import { UserInputError } from 'apollo-server';
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import { getPaletteSyncConfig } from 'palettes/utils';
import { errors } from './definitions';
import NanoleafAuthToken from './NanoleafAuthToken';
import { AuthenticateNewUserInput } from '../NanoleafInputs';
import {
  authenticateWithNanoleafDevice,
  doesDeviceExistsByIpAddress,
  getAllPanelProperties,
} from '../utils';

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
        ? await getPaletteSyncConfig({
            ip: input.ip,
            prisma,
            token,
            userId,
          })
        : {};

      /**
       * * 1. Create device and connect to use via userId
       * * 2. Create nanoleafAuthroken and connect to device via token
       * * 3. Create nanoleafProperties and connect to device via device
       * * 4. Create many or connect existing palettes to device if shouldSyncPalettes = true
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
          nanoleafProperties: {
            create: {
              firmwareVersion,
              name,
              model,
              serialNo,
            },
          },
          palettes: paletteConfig,
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
    try {
      const nanoleafAuthToken = await prisma.nanoleafAuthToken.delete({
        where: { id },
      });

      if (!nanoleafAuthToken) {
        throw new UserInputError(JSON.stringify(errors.authTokenNotFound(id)));
      }

      return id;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default NanoleafAuthTokenResolver;
