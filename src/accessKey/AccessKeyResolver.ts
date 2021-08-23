import { UserInputError } from 'apollo-server';
import { Arg, Ctx, Directive, Mutation, Resolver } from 'type-graphql';
import dayjs from 'dayjs';
import sgMail, { MailDataRequired } from '@sendgrid/mail';

import { Context, RoleEnum } from 'types';
import { User } from 'user';
import { errors as userErrors } from 'user/definitions';
import AccessKey from './AccessKey';
import { constants, errors } from './definitions';
import { validateNewAccessKey } from './utilities';

const { SENDGRID_INVITE_TEMPLATE_ID, WAVEZ_FROM_EMAIL } = constants;

@Resolver(AccessKey)
class AccessKeyResolver {
  @Directive('@authenticated')
  @Directive(`@authorized(role: ${RoleEnum.ADMIN})`)
  @Mutation(() => AccessKey)
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

  @Directive('@authenticated')
  @Directive(`@authorized(role: ${RoleEnum.SUPPORTER})`)
  @Mutation(() => Boolean)
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
        from: WAVEZ_FROM_EMAIL,
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
      console.error(error);

      throw error;
    }
  }
}

export default AccessKeyResolver;
