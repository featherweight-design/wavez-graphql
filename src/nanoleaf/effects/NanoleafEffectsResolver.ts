import { UserInputError } from 'apollo-server';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Context } from 'types';
import NanoleafEffects from './NanoleafEffects';
import { NanoleafPanel } from 'nanoleaf/panel';
import { getEffectsList, updateCurrentEffect } from 'nanoleaf/utils';

@Resolver(NanoleafEffects)
class NanoleafEffectsResolver {
  @FieldResolver(() => NanoleafPanel)
  async properties(
    @Root() effects: NanoleafEffects,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafPanel | null> {
    const properties = await prisma.nanoleafEffects
      .findUnique({
        where: { propertiesId: effects.propertiesId },
      })
      .properties();

    return properties;
  }

  @Query(() => [String])
  async getPanelEffectsList(
    @Arg('deviceId') deviceId: string,
    @Ctx() { prisma }: Context
  ): Promise<string[]> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        nanoleafAuthToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.nanoleafAuthToken) {
      throw new UserInputError('Bad');
    }

    const { ip, nanoleafAuthToken } = deviceProperties;

    const effectsList = await getEffectsList(ip, nanoleafAuthToken.token);

    return effectsList;
  }

  @Mutation(() => Boolean)
  async updateCurrentEffectByDeviceId(
    @Arg('deviceId') deviceId: string,
    @Arg('effectName') effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        nanoleafAuthToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.nanoleafAuthToken) {
      throw new UserInputError('Bad');
    }

    const { ip, nanoleafAuthToken } = deviceProperties;

    await updateCurrentEffect(ip, nanoleafAuthToken.token, {
      select: effectName,
    });

    return true;
  }

  @Mutation(() => Boolean)
  async updateCurrentEffectAll(
    @Arg('userId') userId: string,
    @Arg('effectName') effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Update to utility
    const devices = await prisma.device.findMany({
      where: { userId: userId, type: 'NANOLEAF' },
      include: { nanoleafAuthToken: true },
    });

    if (!devices.length) {
      throw new UserInputError('Bad');
    }

    devices.forEach(async ({ ip, nanoleafAuthToken }) => {
      if (nanoleafAuthToken) {
        await updateCurrentEffect(ip, nanoleafAuthToken.token, {
          select: effectName,
        });
      }
    });

    return true;
  }
}

export default NanoleafEffectsResolver;
