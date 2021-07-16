import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';

import { Context } from 'types';
import User from './User';
import { CreateUserInput } from './UserInputs';

@Resolver(User)
class UserResolver {
  @Query(() => [User], { nullable: true })
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
