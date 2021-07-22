import { NanoleafEffect } from '@prisma/client';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';

import { Context } from 'types';
import { User } from 'user';
import NanoleafAuthToken from './NanoleafAuthToken';
import { AuthenticateNewUserInput } from '../NanoleafInputs';
import {
  authenticateWithNanoleafDevice,
  doesDeviceExistsByIpAddress,
  getAllEffectsDetails,
  getAllPanelProperties,
} from '../utils';

@Resolver(NanoleafAuthToken)
class NanoleafAuthTokenResolver {
  @FieldResolver(() => User)
  async user(
    @Root() nanoleafAuthToken: NanoleafAuthToken,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.nanoleafAuthToken
      .findUnique({
        where: { id: nanoleafAuthToken.id },
      })
      .user();

    return user;
  }

  @Mutation(() => String)
  async authenticateNewNanoleafUser(
    @Arg('input') input: AuthenticateNewUserInput,
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    try {
      //* Check to see if a device with the same IP Address already exists
      await doesDeviceExistsByIpAddress(prisma, input.ip);

      const token = await authenticateWithNanoleafDevice(input.ip);

      //* Get Panel properties with new auth token
      const { firmwareVersion, name, model, serialNo } =
        await getAllPanelProperties(input.ip, token);

      // TODO Palette creation
      /**
       * * 1. Get all device effects details
       * * 2. Extract palettes/color and save to DB
       * * 3. Create effects and connect to palette
       */

      //* Get all effect details for new device
      const effectsDetails = await getAllEffectsDetails(input.ip, token);
      console.log(effectsDetails);

      /**
       * * Currently unable to update array with upsert through Prisma,
       * * so we create a new authToken here and add nanoleadUserId
       */
      await prisma.nanoleafAuthToken.create({
        data: {
          token,
          userId,
        },
      });

      /**
       * * 1. Create device with userId and connect authToken
       * * 2a. Create nanoleafProperties (panel)
       * * 2b. Create effects
       * * 2c. Connect authToken to properties
       */
      const savedEffects = await prisma.device
        .create({
          data: {
            ...input,
            type: 'NANOLEAF',
            userId,
            nanoleafAuthToken: {
              connect: {
                token,
              },
            },
            nanoleafProperties: {
              create: {
                firmwareVersion,
                name,
                model,
                serialNo,
                effects: {
                  create: effectsDetails,
                },
                authToken: {
                  connect: {
                    token,
                  },
                },
              },
            },
          },
          select: {
            nanoleafProperties: {
              select: {
                effects: {
                  select: {
                    id: true,
                    animName: true,
                    pluginUuid: true,
                  },
                },
              },
            },
          },
        })
        .nanoleafProperties()
        .effects();

      //* Create all pulled palettes and connect to matching effects
      savedEffects.forEach(async (effect: NanoleafEffect) => {
        const matchingEffect = effectsDetails.find(
          detail => detail.pluginUuid === effect.pluginUuid
        );

        if (matchingEffect) {
          await prisma.palette.create({
            data: {
              name: effect.animName,
              colors: {
                create: matchingEffect.palette,
              },
              nanoleafEffect: {
                connect: {
                  id: effect.id,
                },
              },
            },
          });
        }
      });

      return token;
    } catch (error) {
      throw new Error(error);
    }
  }

  @Mutation(() => String)
  async deleteNanoleafAuthToken(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    await prisma.nanoleafAuthToken.delete({
      where: { id },
    });

    return id;
  }
}

export default NanoleafAuthTokenResolver;
