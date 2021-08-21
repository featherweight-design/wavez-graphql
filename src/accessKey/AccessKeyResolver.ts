import { Arg, Ctx, Directive, Mutation, Resolver } from 'type-graphql';
import dayjs from 'dayjs';

import { Context, RoleEnum } from 'types';
import AccessKey from './AccessKey';
import { User } from 'user';

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
}

export default AccessKeyResolver;
