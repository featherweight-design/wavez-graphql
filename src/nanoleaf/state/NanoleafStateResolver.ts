import { UserInputError } from 'apollo-server-errors';
import { Arg, Ctx, Mutation, Resolver } from 'type-graphql';

import { Context } from 'types';
import { updateCurrentState } from 'nanoleaf/utils';
import { NanoleafState } from './NanoleafState';
import { NanoleafStateInput } from 'nanoleaf/NanoleafInputs';

@Resolver(NanoleafState)
class NanoleafStateResolver {
  @Mutation(() => Boolean)
  async updateCurrentStateByDeviceId(
    @Arg('deviceId') deviceId: string,
    @Arg('stateInput') stateInput: NanoleafStateInput,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: { nanoleafAuthToken: true },
    });

    if (!deviceProperties || !deviceProperties.nanoleafAuthToken) {
      throw new UserInputError('Bad');
    }

    const { ip, nanoleafAuthToken } = deviceProperties;

    await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);

    return true;
  }

  @Mutation(() => Boolean)
  async updateCurrentStateAll(
    @Arg('stateInput') stateInput: NanoleafStateInput,
    @Arg('userId') userId: string,
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
        await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);
      }
    });

    return true;
  }
}

export default NanoleafStateResolver;
