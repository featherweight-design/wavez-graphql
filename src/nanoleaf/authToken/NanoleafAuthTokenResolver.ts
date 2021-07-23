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

      //* Get all effect details for new device
      const effectsDetails = await getAllEffectsDetails(input.ip, token);

      const connectPalettes = await Promise.all(
        effectsDetails.filter(async ({ animName }) => {
          const doesPaletteExist = await prisma.palette.findUnique({
            where: { name: animName },
          });
          if (doesPaletteExist) {
            return true;
          }

          return false;
        })
      );

      const createPalettes = effectsDetails.filter(({ animName }) =>
        connectPalettes.find(palette => palette.animName === animName)
          ? true
          : false
      );

      console.log(connectPalettes, createPalettes);

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
          userId,
          nanoleafAuthToken: {
            connect: {
              token,
            },
          },
          nanoleafProperties: {
            create: {
              palettes: {
                connect: connectPalettes.map(({ animName }) => ({
                  name: animName,
                })),
                create: createPalettes.map(({ animName, palette }) => ({
                  name: animName,
                  colors: JSON.stringify(palette),
                })),
              },
              firmwareVersion,
              name,
              model,
              serialNo,
              authToken: {
                create: {
                  token,
                  userId,
                },
              },
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
