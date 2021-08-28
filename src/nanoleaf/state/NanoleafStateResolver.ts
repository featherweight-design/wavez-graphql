import { UserInputError } from 'apollo-server-errors';
import { Arg, Ctx, Directive, Mutation, Resolver } from 'type-graphql';

import { Context } from 'types';
import { User } from 'user';
import { NanoleafStateInput } from 'nanoleaf/NanoleafInputs';
import { updateCurrentState } from 'nanoleaf/utils';
import { errors as deviceErrors } from 'device/definitions';
import { errors as userErrors } from 'user/definitions';
import { NanoleafState } from './NanoleafState';
import { copy } from '../definitions';

const { descriptions } = copy;

@Resolver(NanoleafState)
class NanoleafStateResolver {
  @Directive('@authenticated')
  @Mutation(() => Boolean, {
    description: descriptions.updateCurrentStateByDeviceId,
  })
  async updateCurrentStateByDeviceId(
    @Arg('deviceId') deviceId: string,
    @Arg('stateInput') stateInput: NanoleafStateInput,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: { nanoleafAuthToken: true },
      });

      if (!device) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(deviceId))
        );
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(
          JSON.stringify(deviceErrors.deviceNoAuthToken(deviceId))
        );
      }

      const { ip, nanoleafAuthToken } = device;

      await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean, { description: descriptions.updateCurrentStateAll })
  async updateCurrentStateAll(
    @Arg('stateInput') stateInput: NanoleafStateInput,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { userId: (user as User).id, type: 'NANOLEAF' },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(JSON.stringify(userErrors.noDevices));
      }

      devices.forEach(async ({ ip, nanoleafAuthToken }) => {
        if (nanoleafAuthToken) {
          await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);
        }
      });

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default NanoleafStateResolver;
