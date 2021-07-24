import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';

import { Context } from 'types';
import { getPaletteSyncConfig } from 'palettes/utils';
import NanoleafAuthToken from './NanoleafAuthToken';
import { AuthenticateNewUserInput } from '../NanoleafInputs';
import {
  authenticateWithNanoleafDevice,
  doesDeviceExistsByIpAddress,
  getAllPanelProperties,
} from '../utils';
import { Device } from 'device';

@Resolver(NanoleafAuthToken)
class NanoleafAuthTokenResolver {
  @FieldResolver(() => Device)
  async device(
    @Root() nanoleafAuthToken: NanoleafAuthToken,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    const device = await prisma.nanoleafAuthToken
      .findUnique({
        where: { id: nanoleafAuthToken.id },
      })
      .device();

    return device;
  }

  @Mutation(() => String)
  async authenticateWithDeviceByUserId(
    @Ctx() { prisma }: Context,
    @Arg('input') input: AuthenticateNewUserInput,
    @Arg('userId') userId: string,
    @Arg('shouldSyncPalettes', { nullable: true, defaultValue: false })
    shouldSyncPalettes?: boolean
  ): Promise<string> {
    try {
      //* Check to see if a device with the same IP Address already exists
      await doesDeviceExistsByIpAddress(prisma, input.ip);

      const token = await authenticateWithNanoleafDevice(input.ip);

      //* Get Panel properties with new auth token
      const { firmwareVersion, name, model, serialNo } =
        await getAllPanelProperties(input.ip, token);

      //* Get all effect details for new device
      const paletteConfig = shouldSyncPalettes
        ? getPaletteSyncConfig({
            ip: input.ip,
            prisma,
            token,
            userId,
          })
        : {};

      /**
       * * 1. Create device with userId and connect authToken
       * * 2a. Create nanoleafProperties (panel)
       * * 2b. Create many palettes to nanoleafProperties
       * * 2c. Create authToken
       */
      await prisma.device.create({
        data: {
          ...input,
          type: 'NANOLEAF',
          user: {
            connect: {
              id: userId,
            },
          },
          nanoleafAuthToken: {
            create: {
              token,
            },
          },
          ...paletteConfig,
          nanoleafProperties: {
            create: {
              firmwareVersion,
              name,
              model,
              serialNo,
            },
          },
        },
      });

      return token;
    } catch (error) {
      console.log(error);
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
