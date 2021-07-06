const fetch = require("node-fetch");
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

import { Context, NanoLeafAuthenticationResponse } from "types";
import { User } from "user";
import { NanoleafAuthToken, NanoleafUser } from "./Nanoleaf";
// import { CreateNanoleafUserInput } from "./NanoleafInputs";

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

      return authToken;
    } catch (error) {
      throw new Error(error);
    }
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

export { NanoleafUserResolver, NanoleafAuthTokenResolver };
