import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from "type-graphql";

import { Context } from "types";
import NanoleafAuthToken from "./NanoleafAuthToken";
import { NanoleafUser } from "nanoleaf/nanoleafUser";
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

      const token = await authenticateWithNanoleafDevice(input.ip);

      //* Get Panel properties with new auth token
      const { firmwareVersion, name, model, serialNo, effects } =
        await getAllPanelProperties(input.ip, token);

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

      /**
       * * Currently unable to update array with upsert through Prisma,
       * * so we create a new authToken here and add nanoleadUserId
       */
      await prisma.nanoleafAuthToken.create({
        data: {
          token,
          nanoleafUserId: nanoleafUser.id,
        },
      });

      /**
       * * 1. Create device with userId and connect authToke
       * * 2a. Create nanoleafProperties (panel)
       * * 2b. Create effects
       * * 2c. Connect authToken to panel
       */
      await prisma.device.create({
        data: {
          ...input,
          type: "NANOLEAF",
          userId,
          nanoleafAuthToken: {
            connect: {
              token,
            },
          },
          nanoleafProperties: {
            create: {
              firmwareVersion,
              name,
              model,
              serialNo,
              effects: {
                create: {
                  ...effects
                }
              },
              authToken: {
                connect: {
                  token,
                },
              },
            },
          },
        },
      });

      return token;
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
