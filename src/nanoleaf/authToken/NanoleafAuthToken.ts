import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";

import { Context } from "types";
import NanoleafAuthToken from "./NanoleafAuthTokenResolver";
import { NanoleafUser } from "../Nanoleaf";
import { AuthenticateNewUserInput } from "../NanoleafInputs";
import {
  authenticateWithNanoleafDevice,
  doesDeviceExistsByIpAddress,
  getAllPanelProperties,
} from "../utils";

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

export default NanoleafAuthTokenResolver;
