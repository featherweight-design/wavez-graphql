import { UserInputError } from 'apollo-server';
import { Arg, Ctx, Directive, Mutation, Query, Resolver } from 'type-graphql';
import dayjs from 'dayjs';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { Context, RoleEnum } from 'types';
import { User } from 'user';
import { errors as userErrors } from 'user/definitions';
import AccessKey from './AccessKey';
import { constants, copy, errors } from './definitions';
import { validateNewAccessKey } from './utilities';

const { SENDGRID_INVITE_TEMPLATE_ID } = constants;
const { descriptions } = copy;

@Resolver(AccessKey)
class AccessKeyResolver {
  @Query(() => Boolean, { description: descriptions.findAccessKeyByEmail })
  async findAccessKeyByEmail(
    @Arg('email') email: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const foundAccessKey = await prisma.accessKey.findUnique({
        where: {
          email,
        },
      });

      if (!foundAccessKey) {
        throw new UserInputError(JSON.stringify(errors.notFound));
      }

      //* Check if access key is expired (3 days from creation)
      if (dayjs().isAfter(dayjs(foundAccessKey.expireAt))) {
        //* Delete access key if expired
        await prisma.accessKey.delete({
          where: {
            id: foundAccessKey.id,
          },
        });

        throw new UserInputError(JSON.stringify(errors.expired));
      }

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive(`@authorized(role: ${RoleEnum.ADMIN})`)
  @Directive('@authenticated')
  @Mutation(() => AccessKey, { description: descriptions.createAccessKey })
  async createAccessKey(
    @Arg('email') email: string,
    @Ctx() { prisma, user }: Context
  ): Promise<AccessKey> {
    try {
      await validateNewAccessKey(prisma, email);

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

  @Directive(`@authorized(role: ${RoleEnum.ADMIN})`)
  @Directive('@authenticated')
  @Mutation(() => Boolean, { description: descriptions.deleteAccessKeyById })
  async deleteAccessKeyById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      await prisma.accessKey.delete({
        where: { id },
      });

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive(`@authorized(role: ${RoleEnum.SUPPORTER})`)
  @Directive('@authenticated')
  @Mutation(() => Boolean, { description: descriptions.inviteByEmail })
  async inviteByEmail(
    @Arg('email') email: string,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      await validateNewAccessKey(prisma, email);

      //* Check if user has invites left
      if (!user?.invites) {
        throw new UserInputError(JSON.stringify(userErrors.noInvites));
      }

      //* Create access key
      const expireAt = dayjs().add(3, 'day').toISOString();

      const accessKey = await prisma.accessKey.create({
        data: {
          email,
          expireAt,
          userId: user.id,
        },
      });

      //* Instantiate SG client
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      //* Build SG email message
      const message: MailDataRequired = {
        to: email,
        from: process.env.WAVEZ_FROM_EMAIL,
        templateId: SENDGRID_INVITE_TEMPLATE_ID,
        dynamicTemplateData: {
          accessKey: accessKey.key,
          senderName: user?.name,
          expireAt: dayjs(expireAt).format('dddd, MMMM D, YYYY'),
        },
      };

      //* Send message
      await sgMail.send(message);

      //* Decrement user invites by one
      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          invites: user.invites - 1,
        },
      });

      return true;
    } catch (error) {
      // TODO: Update error handling to delete access key if SG fails
      console.error(error);

      throw error;
    }
  }
}

export default AccessKeyResolver;
