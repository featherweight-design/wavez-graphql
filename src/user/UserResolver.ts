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
import { CreateUserInput, UpdateUserInput } from './UserInputs';
import { Palette } from 'palettes';
import { UserInputError } from 'apollo-server';
import { errors as userErrors } from './definitions';

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
    try {
      const users = await prisma.user.findMany();

      return users;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Query(() => User, { nullable: true })
  async getUserById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({ where: { id } });

      if (!user) {
        throw new UserInputError(JSON.stringify(userErrors.userNoFound(id)));
      }

      return user;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => User)
  async createUser(
    @Arg('input') input: CreateUserInput,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    try {
      const user = prisma.user.create({
        data: input,
      });

      return user;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => User)
  async updateUser(
    @Arg('id') id: string,
    @Arg('input') input: UpdateUserInput,
    @Ctx() { prisma }: Context
  ): Promise<User> {
    try {
      const updatedUser = prisma.user.update({
        where: {
          id,
        },
        data: input,
      });

      return updatedUser;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default UserResolver;
