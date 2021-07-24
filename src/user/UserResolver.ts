import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import User from './User';
import { CreateUserInput } from './UserInputs';
import { Palette } from 'palettes';

@Resolver(User)
class UserResolver {
  @FieldResolver(() => [Device])
  async devices(
    @Root() user: User,
    @Ctx() { prisma }: Context
  ): Promise<Device[]> {
    const devices = await prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .devices();

    return devices;
  }

  @FieldResolver(() => [Palette])
  async palettes(
    @Root() user: User,
    @Ctx() { prisma }: Context
  ): Promise<Palette[]> {
    const palettes = await prisma.user
      .findUnique({
        where: {
          id: user.id,
        },
      })
      .palettes();

    return palettes;
  }

  @Query(() => [User])
  async getAllUsers(@Ctx() { prisma }: Context): Promise<User[]> {
    const users = await prisma.user.findMany();

    return users;
  }

  @Query(() => User, { nullable: true })
  async getUserById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { id } });

    return user;
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    const user = prisma.user.create({
      data: input,
    });

    return user;
  }
}

export default UserResolver;
