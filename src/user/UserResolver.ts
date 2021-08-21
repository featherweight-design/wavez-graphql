import dayjs from 'dayjs';
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
import { Context, RoleEnum } from 'types';
import { errors as accessKeyErrors } from 'accessKey/definitions';
import { SignInResponse, User } from './User';
import { CreateUserInput, UpdateUserInput } from './UserInputs';
import { Palette } from 'palettes';
import { UserInputError } from 'apollo-server';
import { errors } from './definitions';

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
  @Directive(`@authorized(role: ${RoleEnum.ADMIN})`)
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

  @Mutation(() => SignInResponse)
  async signUp(
    @Arg('input') input: CreateUserInput,
    @Ctx() { createToken, prisma }: Context
  ): Promise<SignInResponse> {
    try {
      //* Check if email is already used
      const doesUserExist = await prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (doesUserExist) {
        throw new UserInputError(JSON.stringify(errors.userAlreadyExists));
      }

      //* Check if access key exists
      const foundAccessKey = await prisma.accessKey.findUnique({
        where: {
          key: input.accessKey,
        },
      });

      if (!foundAccessKey) {
        throw new UserInputError(JSON.stringify(accessKeyErrors.notFound));
      }

      //* Check is email on access key matches provided email
      if (foundAccessKey.email !== input.email) {
        throw new UserInputError(JSON.stringify(accessKeyErrors.wrongEmail));
      }

      //* Check if access key is expired (3 days from creation)
      if (dayjs().isAfter(dayjs(foundAccessKey.expireAt))) {
        //* Delete access key if expired
        await prisma.accessKey.delete({
          where: {
            id: foundAccessKey.id,
          },
        });

        throw new UserInputError(JSON.stringify(accessKeyErrors.expired));
      }

      const user = await prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
          invitedBy: {
            connect: {
              id: foundAccessKey.userId,
            },
          },
        },
      });

      const token = createToken(user);

      //* Delete used access key
      await prisma.accessKey.delete({
        where: {
          id: foundAccessKey.id,
        },
      });

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
