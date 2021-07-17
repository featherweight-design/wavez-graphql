import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';

import { Context } from 'types';
import { User } from 'user';
import { NanoleafAuthToken } from 'nanoleaf/authToken';
import NanoleafUser from './NanoleafUser';

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

  @Query(() => NanoleafUser, { nullable: true })
  async getNanoleafUserById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafUser | null> {
    const nanoleafUser = await prisma.nanoleafUser.findUnique({
      where: { id },
    });

    return nanoleafUser;
  }
}

export default NanoleafUserResolver;
