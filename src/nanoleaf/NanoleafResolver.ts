const fetch = require("node-fetch");
import { UserInputError } from "apollo-server";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { Context, NanoLeafAuthenticationResponse } from "types";
import { NanoleafAuthToken, NanoleafUser } from "./Nanoleaf";
import { CreateNanoleafUserInput } from "./NanoleafInputs";

@Resolver(NanoleafAuthToken)
class NanoleafAuthTokenResolver {
  @Mutation(() => String)
  async authenticateNewUser(
    @Arg("ipAddress") ipAddress: string,
    @Arg("userId") userId: string,
    @Ctx() { prisma }: Context
  ): Promise<String> {
    try {
      const response = await fetch(`http://${ipAddress}:16021/api/v1/new`, {
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

      const { auth_token: authToken }: NanoLeafAuthenticationResponse =
        await response.json();

      await prisma.nanoleafUser.upsert({
        where: {
          userId,
        },
        update: {},
        create: {
          authTokens: {
            create: {
              authToken,
            },
          },
          userId,
        },
      });

      return authToken;
    } catch (error) {
      throw new Error(error);
    }
  }
}

@Resolver(NanoleafUser)
class NanoleafUserResolver {
  @Mutation(() => NanoleafUser)
  async createNanoleafUser(
    @Arg("input") input: CreateNanoleafUserInput,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafUser | null> {
    const nanoleafUser = (await prisma.nanoleafUser.create({
      data: {
        userId: input.userId,
        authTokens: {
          create: { authToken: input.authToken },
        },
      },
    })) as NanoleafUser;
    console.log(nanoleafUser);

    return nanoleafUser;
  }
}

export { NanoleafUserResolver, NanoleafAuthTokenResolver };
