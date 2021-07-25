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
    try {
      const device = await prisma.device.findUnique({
        where: { id: deviceId },
        include: { nanoleafAuthToken: true },
      });

      if (!device) {
        throw new UserInputError(`Device by id ${deviceId} does not exist`);
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(
          `Device by id ${device.id} does not have an associated auth token`
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

  @Mutation(() => Boolean)
  async updateCurrentStateAll(
    @Arg('stateInput') stateInput: NanoleafStateInput,
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { userId: userId, type: 'NANOLEAF' },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(
          `User by id ${userId} has no associated devices`
        );
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
