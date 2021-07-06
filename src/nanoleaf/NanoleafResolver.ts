import { UserInputError } from "apollo-server";
import fetch from "node-fetch";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import {
  Context,
  NanoleafAuthenticationResponse,
  NanoleafPanelGetResponse,
} from "types";
import { User } from "user";
import { NanoleafAuthToken, NanoleafPanel, NanoleafUser } from "./Nanoleaf";
import { AuthenticateNewUserInput } from "./NanoleafInputs";

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
  async authenticateNewUser(
    @Arg("input") input: AuthenticateNewUserInput,
    @Arg("userId") userId: string,
    @Ctx() { prisma }: Context
  ): Promise<String> {
    try {
      //* Check to see if a device with the same IP Address already exists
      const doesDeviceExist = await prisma.device.findUnique({
        where: {
          ip: input.ip,
        },
      });

      //* IP addresses much be unique, so throw error accordingly
      if (doesDeviceExist) {
        throw new UserInputError(
          `A device using the IP Address ${input.ip} already exists.`
        );
      }

      const nanoleafBaseApiUrl = `http://${input.ip}:16021/api/v1`;

      // TODO: Migrate to utility
      const response = await fetch(`${nanoleafBaseApiUrl}/new`, {
        method: "POST",
      });

      if (
        !response.ok &&
        (response.status === 401 || response.status === 403)
      ) {
        throw new UserInputError(
          `Status: ${response.status}: Unable to authenticate with Nanoleaf device. Ensure that your device is ready to authenticate by holding down the power button until the lights start blinking (5-7 seconds).`
        );
      }

      const { auth_token: authToken }: NanoleafAuthenticationResponse =
        await response.json();

      // TODO Migrate to utility
      //* Get Panel properties with new auth token
      const panelResponse = await fetch(`${nanoleafBaseApiUrl}/${authToken}`);

      const {
        firmwareVersion,
        name,
        model,
        serialNo,
      }: NanoleafPanelGetResponse = await panelResponse.json();

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

@Resolver(NanoleafPanel)
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

export { NanoleafUserResolver, NanoleafAuthTokenResolver };
