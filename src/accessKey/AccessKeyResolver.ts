import { UserInputError } from 'apollo-server';
import { Arg, Ctx, Directive, Mutation, Resolver } from 'type-graphql';
import dayjs from 'dayjs';

import { Context, RoleEnum } from 'types';
import { User } from 'user';
import AccessKey from './AccessKey';
import { errors } from './definitions';

@Resolver(AccessKey)
class AccessKeyResolver {
  @Directive('@authenticated')
  @Directive(`@authorized(role: ${RoleEnum.SUPPORTER})`)
  @Mutation(() => AccessKey)
  async createAccessKey(
    @Arg('email') email: string,
    @Ctx() { prisma, user }: Context
  ): Promise<AccessKey> {
    try {
      const expireAt = dayjs().add(3, 'day').toISOString();

      const accessKey = await prisma.accessKey.create({
        data: {
          email,
          expireAt,
          userId: (user as User).id,
        },
      });

      return accessKey;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Directive(`@authorized(role: ${RoleEnum.ADMIN})`)
  @Mutation(() => AccessKey)
  async deleteAccessKeyById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    try {
      const accessKey = await prisma.accessKey.delete({
        where: { id },
      });

      if (!accessKey) {
        throw new UserInputError(JSON.stringify(errors.notFound));
      }

      return id;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default AccessKeyResolver;
