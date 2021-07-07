import fetch from "node-fetch";
import { UserInputError } from "apollo-server";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { Context } from "types";
import { User } from "user";
import { constants } from "./definitions";
import {
  NanoleafAuthToken,
  NanoleafEffects,
  NanoleafPanel,
  NanoleafUser,
} from "./Nanoleaf";
import { AuthenticateNewUserInput } from "./NanoleafInputs";
import {
  authenticateWithNanoleafDevice,
  doesDeviceExistsByIpAddress,
  getAllPanelProperties,
} from "./utils";

@Resolver(NanoleafAuthToken)
class NanoleafAuthTokenResolver {
  @FieldResolver(() => NanoleafUser)
  async nanoleafUser(
    @Root() NanoleafAuthToken: NanoleafAuthToken,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafUser | null> {
    const nanoleafUser = await prisma.nanoleafAuthToken
      .findUnique({ where: { id: NanoleafAuthToken.id } })
      .nanoleafUser();

    return nanoleafUser;
  }

  @Mutation(() => String)
  async authenticateNewNanoleafUser(
    @Arg("input") input: AuthenticateNewUserInput,
    @Arg("userId") userId: string,
    @Ctx() { prisma }: Context
  ): Promise<String> {
    try {
      //* Check to see if a device with the same IP Address already exists
      doesDeviceExistsByIpAddress(prisma, input.ip);

      const authToken = await authenticateWithNanoleafDevice(input.ip);

      //* Get Panel properties with new auth token
      const { firmwareVersion, name, model, serialNo } =
        await getAllPanelProperties(input.ip, authToken);

      //* Nanoleaf user is created here if it doesn't already exist
      const nanoleafUser = await prisma.nanoleafUser.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          userId,
        },
      });

      //* Currently unable to update array with upsert through Prisma,
      //* so we create a new authToken here
      await prisma.nanoleafAuthToken.create({
        data: {
          authToken,
          nanoleafUserId: nanoleafUser.id,
        },
      });

      //* Create Panel in DB with NL auth token id
      const panel = await prisma.nanoleafProperties.create({
        data: {
          firmwareVersion,
          name,
          model,
          serialNo,
          authToken: {
            connect: {
              authToken: authToken,
            },
          },
        },
      });

      //* Create new user device with NL properites and user id
      await prisma.device.create({
        data: {
          ...input,
          type: "NANOLEAF",
          nanoleafPropertiesId: panel.id,
          userId,
        },
      });

      return authToken;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => String)
  async deleteNanoleafAuthToken(
    @Arg("id") id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    await prisma.nanoleafAuthToken.delete({
      where: { id },
    });

    return id;
  }
}

@Resolver(NanoleafEffects)
class NanoleafEffectsResolver {
  @FieldResolver(() => NanoleafPanel)
  async properties(
    @Root() effects: NanoleafEffects,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafPanel | null> {
    const properties = await prisma.nanoleafEffects
      .findUnique({
        where: { propertiesId: effects.propertiesId },
      })
      .properties();

    return properties;
  }

  @Query(() => [String])
  async getPanelEffectsList(
    @Arg("deviceId") deviceId: string,
    @Ctx() { prisma }: Context
  ): Promise<string[]> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        authToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.authToken) {
      throw new UserInputError("Bad");
    }

    const { ip, authToken } = deviceProperties;

    const { effects } = await getAllPanelProperties(ip, authToken.authToken);

    return effects.effectsList;
  }

  @Mutation(() => Boolean)
  async updateCurrentEffectByDeviceId(
    @Arg("deviceId") deviceId: string,
    @Arg("effectName") effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        authToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.authToken) {
      throw new UserInputError("Bad");
    }

    // TODO: Update schema to authToken.token
    const { ip, authToken } = deviceProperties;

    await fetch(constants.endpoints.update.effect(ip, authToken.authToken), {
      method: "PUT",
      body: JSON.stringify({ select: effectName }),
    });

    return true;
  }

  @Mutation(() => Boolean)
  async updateAllCurrentEffect(
    @Arg("userId") userId: string,
    @Arg("effectName") effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Update to utility
    const devices = await prisma.device.findMany({
      where: { userId: userId, type: "NANOLEAF" },
      include: { authToken: true },
    });

    if (!devices.length) {
      throw new UserInputError("Bad");
    }

    devices.forEach(async ({ ip, authToken }) => {
      if (authToken) {
        await fetch(
          constants.endpoints.update.effect(ip, authToken.authToken),
          {
            method: "PUT",
            body: JSON.stringify({ select: effectName }),
          }
        );
      }
    });

    return true;
  }
}

@Resolver(NanoleafUser)
class NanoleafUserResolver {
  @FieldResolver(() => [NanoleafAuthToken])
  async authTokens(
    @Root() nanoleafUser: NanoleafUser,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafAuthToken[]> {
    const authTokens = await prisma.nanoleafUser
      .findUnique({ where: { id: nanoleafUser.id } })
      .authTokens();

    return authTokens;
  }

  @FieldResolver(() => User)
  async user(
    @Root() nanoleafUser: NanoleafUser,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.nanoleafUser
      .findUnique({ where: { id: nanoleafUser.id } })
      .user();

    return user;
  }

  @Query(() => [NanoleafUser])
  async getAllNanoleafUsers(
    @Ctx() { prisma }: Context
  ): Promise<NanoleafUser[]> {
    const nanoleafUsers = await prisma.nanoleafUser.findMany();

    return nanoleafUsers;
  }

  @Query(() => NanoleafUser)
  async getNanoleafUserById(
    @Arg("id") id: string,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafUser | null> {
    const nanoleafUser = await prisma.nanoleafUser.findUnique({
      where: { id },
    });

    return nanoleafUser;
  }
}

export {
  NanoleafAuthTokenResolver,
  NanoleafEffectsResolver,
  NanoleafUserResolver,
};
