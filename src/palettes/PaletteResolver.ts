import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import { User } from 'user';
import Palette from './Palette';
import { getPaletteSyncConfig } from './utils';
import { updateEffectName } from 'nanoleaf/utils';

@Resolver(Palette)
class PaletteResolver {
  @FieldResolver(() => [Device])
  async devices(
    @Root() palette: Palette,
    @Ctx() { prisma }: Context
  ): Promise<Device[]> {
    const devices = await prisma.palette
      .findUnique({
        where: { id: palette.id },
      })
      .devices();

    return devices;
  }

  @FieldResolver(() => User)
  async user(
    @Root() palette: Palette,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.palette
      .findUnique({
        where: {
          id: palette.id,
        },
      })
      .user();

    return user;
  }

  @Query(() => [Palette])
  async getAllPalettesByUserId(
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette[]> {
    const palettes = await prisma.palette.findMany({
      where: {
        userId,
      },
    });

    return palettes;
  }

  @Query(() => Palette, { nullable: true })
  async getPaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette | null> {
    const palette = await prisma.palette.findUnique({
      where: {
        id,
      },
    });

    return palette;
  }

  @Mutation(() => String)
  async deletePaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    await prisma.palette.delete({
      where: { id },
    });

    return id;
  }

  @Mutation(() => [Palette])
  async syncPalettesByDeviceId(
    @Arg('deviceId') deviceId: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette[]> {
    try {
      const device = await prisma.device.findUnique({
        where: {
          id: deviceId,
        },
        include: {
          nanoleafAuthToken: true,
        },
      });

      if (!device) {
        throw new Error(`No Device found by id: ${deviceId}`);
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(
          `Device by id ${deviceId} does not have an associated auth token`
        );
      }

      const {
        ip,
        userId,
        nanoleafAuthToken: { token },
      } = device;
      const paletteConfig = await getPaletteSyncConfig({
        ip,
        prisma,
        token,
        userId,
      });

      const createdPalettes = prisma.device
        .update({
          where: {
            id: deviceId,
          },
          data: {
            palettes: paletteConfig,
          },
          select: {
            palettes: true,
          },
        })
        .palettes();

      return createdPalettes;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => Palette)
  async updatePaletteNameById(
    @Arg('id') id: string,
    @Arg('newName') newName: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette> {
    try {
      //* Get all devices by Palette id
      const palette = await prisma.palette.findUnique({
        where: {
          id,
        },
        select: {
          name: true,
          devices: {
            select: {
              id: true,
              ip: true,
              nanoleafAuthToken: {
                select: {
                  token: true,
                },
              },
            },
          },
        },
      });

      if (!palette) {
        throw new Error(`Palette not found by id: ${id}`);
      }

      if (!palette.devices.length) {
        throw new Error(
          `Palette by id ${id} does not have any associated devices`
        );
      }

      //* Update palette in Nanoleaf first
      await Promise.all(
        palette.devices.map(async ({ id, ip, nanoleafAuthToken }) => {
          if (!nanoleafAuthToken) {
            throw new Error(
              `Device by id ${id} does not have an associate auth token`
            );
          }

          await updateEffectName({
            ipAddress: ip,
            authToken: nanoleafAuthToken?.token,
            existingName: palette.name,
            newName,
          });
        })
      );

      //* On success, update palette in DB
      //* Return updated Palette
      const updatedPalette = await prisma.palette.update({
        where: {
          id,
        },
        data: {
          name: newName,
        },
      });

      return updatedPalette;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default PaletteResolver;
