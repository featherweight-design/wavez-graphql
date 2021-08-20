import {
  Arg,
  Ctx,
  Directive,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import { SignInResponse, User } from './User';
import { CreateUserInput, UpdateUserInput } from './UserInputs';
import { Palette } from 'palettes';
import { UserInputError } from 'apollo-server';
import { errors, errors as userErrors } from './definitions';

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

  @Directive('@authenticated')
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

  @Directive('@authenticated')
  @Query(() => User)
  getCurrentUser(@Ctx() { user }: Context): User {
    return user as User;
  }

  @Mutation(() => User)
  async signUp(
    @Arg('input') input: CreateUserInput,
    @Ctx() { createToken, prisma }: Context
  ): Promise<SignInResponse> {
    try {
      const doesUserExist = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (doesUserExist) {
        throw new UserInputError(JSON.stringify(errors.userAlreadyExists));
      }

      const user = await prisma.user.create({
        data: input,
      });

      const token = createToken(user);

      return { token, user };
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => SignInResponse)
  async signIn(
    @Arg('email') email: string,
    @Ctx() { createToken, prisma }: Context
  ): Promise<SignInResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        throw new UserInputError(JSON.stringify(errors.userNotFound));
      }

      const token = createToken(user);

      return { token, user };
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => User)
  async updateUser(
    @Arg('input') input: UpdateUserInput,
    @Ctx() { prisma, user }: Context
  ): Promise<User> {
    try {
      const updatedUser = prisma.user.update({
        where: {
          id: (user as User).id,
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
