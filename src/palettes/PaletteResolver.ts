import { ForbiddenError, UserInputError } from 'apollo-server';
import {
  Arg,
  Ctx,
  Directive,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import { User } from 'user';
import {
  updateCurrentEffect,
  updateEffectName,
  updateEffectPalette,
} from 'nanoleaf/utils';
import { errors as deviceErrors } from 'device/definitions';
import { errors as userErrors } from 'user/definitions';
import Palette from './Palette';
import {
  CreatePaletteInput,
  SetPaletteByDeviceIdInput,
  SetPaletteByDeviceType,
  UpdatePaletteColorsInput,
  UpdatePaletteNameInput,
} from './PaletteInputs';
import { getPaletteSyncConfig, validateColorJson } from './utils';
import { errors } from './definitions';

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

  @Directive('@authenticated')
  @Query(() => [Palette])
  async getAllPalettesByUserId(
    @Ctx() { prisma, user }: Context
  ): Promise<Palette[]> {
    const palettes = await prisma.palette.findMany({
      where: {
        userId: (user as User).id,
      },
    });

    return palettes;
  }

  @Directive('@authenticated')
  @Query(() => Palette, { nullable: true })
  async getPaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma, user }: Context
  ): Promise<Palette | null> {
    const palette = await prisma.palette.findUnique({
      where: {
        id,
      },
    });

    if (!palette) {
      throw new UserInputError(JSON.stringify(errors.paletteNotFound));
    }

    if (palette.userId !== user?.id) {
      throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
    }

    return palette;
  }

  @Directive('@authenticated')
  @Mutation(() => Palette)
  async createPalette(
    @Arg('input') input: CreatePaletteInput,
    @Ctx() { prisma, user }: Context
  ): Promise<Palette> {
    try {
      //* Parse and validate colors
      const parsedColors = validateColorJson(input.colors);

      //* Add to DB
      const palette = prisma.palette.create({
        data: {
          name: input.name,
          colors: JSON.stringify(parsedColors),
          userId: (user as User).id,
        },
      });

      //* Return palette
      return palette;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => String)
  async deletePaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma, user }: Context
  ): Promise<string> {
    const palette = await prisma.palette.findUnique({
      where: {
        id,
      },
    });

    if (!palette) {
      throw new UserInputError(JSON.stringify(errors.paletteNotFound));
    }

    if (palette.userId !== user?.id) {
      throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
    }

    await prisma.palette.delete({
      where: { id },
    });

    return id;
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean)
  async setPaletteToAllDevicesByUserId(
    @Arg('id') id: string,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      //* Grab palette
      const palette = await prisma.palette.findUnique({
        where: {
          id,
        },
      });

      if (!palette) {
        throw new UserInputError(JSON.stringify(errors.paletteNotFound));
      }

      if (palette?.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      //* Grab all devices
      const devices = await prisma.device.findMany({
        where: {
          userId: user.id,
        },
        include: {
          nanoleafAuthToken: true,
        },
      });

      if (!devices.length) {
        throw new UserInputError(JSON.stringify(userErrors.userNoDevices));
      }

      if (devices[0].userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      //* Make update calls to Nanoleaf devices
      await Promise.all(
        devices.map(async device => {
          //* Handle errors for auth token
          if (!device.nanoleafAuthToken) {
            throw new Error(
              JSON.stringify(deviceErrors.deviceNoAuthToken(device.id))
            );
          }

          //* Update through Nanoleaf API
          await updateCurrentEffect(
            device.ip,
            device.nanoleafAuthToken.token,
            palette.name
          );
        })
      );

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean)
  async setPaletteToDeviceById(
    @Arg('input') input: SetPaletteByDeviceIdInput,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      //* Grab palette
      const palette = await prisma.palette.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!palette) {
        throw new UserInputError(JSON.stringify(errors.paletteNotFound));
      }

      if (palette.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      //* Grab all devices
      const device = await prisma.device.findUnique({
        where: {
          id: input.deviceId,
        },
        include: {
          nanoleafAuthToken: true,
        },
      });

      if (!device) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(input.deviceId))
        );
      }

      if (device.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      //* Handle errors for auth token
      if (!device.nanoleafAuthToken) {
        throw new Error(
          JSON.stringify(deviceErrors.deviceNoAuthToken(device.id))
        );
      }

      //* Update through Nanoleaf API
      await updateCurrentEffect(
        device.ip,
        device.nanoleafAuthToken.token,
        palette.name
      );

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean)
  async setPaletteToDeviceByType(
    @Arg('input') input: SetPaletteByDeviceType,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      //* Grab palette
      const palette = await prisma.palette.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!palette) {
        throw new UserInputError(JSON.stringify(errors.paletteNotFound));
      }

      if (palette.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      //* Grab all devices
      const devices = await prisma.device.findMany({
        where: {
          type: input.type,
        },
        include: {
          nanoleafAuthToken: true,
        },
      });

      if (!devices.length) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.noDevicesByType(input.type))
        );
      }

      //* Make update calls to Nanoleaf devices
      await Promise.all(
        devices.map(async device => {
          //* Handle errors for auth token
          if (!device.nanoleafAuthToken) {
            throw new Error(
              JSON.stringify(deviceErrors.deviceNoAuthToken(device.id))
            );
          }

          //* Update through Nanoleaf API
          await updateCurrentEffect(
            device.ip,
            device.nanoleafAuthToken.token,
            palette.name
          );
        })
      );

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => [Palette])
  async syncPalettesByDeviceId(
    @Arg('deviceId') deviceId: string,
    @Ctx() { prisma, user }: Context
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
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(deviceId))
        );
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(
          JSON.stringify(deviceErrors.deviceNoAuthToken(device.id))
        );
      }

      if (device.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
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
          include: {
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

  @Directive('@authenticated')
  @Mutation(() => Palette)
  async updatePaletteNameById(
    @Arg('input') input: UpdatePaletteNameInput,
    @Ctx() { prisma, user }: Context
  ): Promise<Palette> {
    try {
      //* Get all devices by Palette id
      const palette = await prisma.palette.findUnique({
        where: {
          id: input.id,
        },
        include: {
          devices: {
            include: {
              nanoleafAuthToken: true,
            },
          },
        },
      });

      if (!palette) {
        throw new UserInputError(JSON.stringify(errors.paletteNotFound));
      }

      if (palette.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      if (input.shouldUpdateDevices) {
        if (!palette.devices.length) {
          throw new Error(JSON.stringify(errors.paletteNoDevices));
        }

        //* Update palette in Nanoleaf first
        await Promise.all(
          palette.devices.map(async ({ id, ip, nanoleafAuthToken, userId }) => {
            if (!nanoleafAuthToken) {
              throw new Error(
                JSON.stringify(deviceErrors.deviceNoAuthToken(id))
              );
            }

            if (userId !== user?.id) {
              throw new ForbiddenError(
                JSON.stringify(userErrors.userNotAuthorized)
              );
            }

            await updateEffectName({
              ipAddress: ip,
              authToken: nanoleafAuthToken?.token,
              existingName: palette.name,
              newName: input.newName,
            });
          })
        );
      }

      //* On success, update palette in DB
      //* Return updated Palette
      const updatedPalette = await prisma.palette.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.newName,
        },
      });

      return updatedPalette;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Palette)
  async updatePaletteColorsById(
    @Arg('input') input: UpdatePaletteColorsInput,
    @Ctx() { prisma, user }: Context
  ): Promise<Palette> {
    try {
      //* Get all devices by Palette id
      const palette = await prisma.palette.findUnique({
        where: {
          id: input.id,
        },
        include: {
          devices: {
            include: {
              nanoleafAuthToken: true,
            },
          },
        },
      });

      if (!palette) {
        throw new UserInputError(JSON.stringify(errors.paletteNotFound));
      }

      if (palette.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.userNotAuthorized));
      }

      if (!palette.devices.length) {
        throw new Error(JSON.stringify(errors.paletteNoDevices));
      }

      if (input.shouldUpdateDevices) {
        //* Update palette in Nanoleaf first
        await Promise.all(
          palette.devices.map(async ({ id, ip, nanoleafAuthToken, userId }) => {
            if (!nanoleafAuthToken) {
              throw new Error(
                JSON.stringify(deviceErrors.deviceNoAuthToken(id))
              );
            }

            if (userId !== user?.id) {
              throw new ForbiddenError(
                JSON.stringify(userErrors.userNotAuthorized)
              );
            }

            await updateEffectPalette({
              ipAddress: ip,
              authToken: nanoleafAuthToken?.token,
              paletteName: palette.name,
              colors: input.newColors,
            });
          })
        );
      }

      //* On success, update palette in DB
      //* Return updated Palette
      const updatedPalette = await prisma.palette.update({
        where: {
          id: input.id,
        },
        data: {
          colors: input.newColors,
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
