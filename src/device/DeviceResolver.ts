import Prisma, { DeviceType } from '@prisma/client';
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
import find from 'local-devices';

import { NanoleafAuthToken, NanoleafProperties } from 'nanoleaf';
import { Palette } from 'palettes';
import { Context, DeviceMacSubstringByType } from 'types';
import { User } from 'user';
import { updateCurrentState } from 'nanoleaf/utils';
import { errors as userErrors } from 'user/definitions';
import { copy, errors as deviceErrors } from './definitions';
import { Device, WifiDevice } from './Device';

const { descriptions } = copy;

const findeDeviceByType = (device: WifiDevice, macSubstring: string) =>
  device.mac.toLocaleLowerCase().includes(macSubstring.toLocaleLowerCase());

@Resolver(Device)
class DeviceResolver {
  @FieldResolver(() => NanoleafAuthToken)
  async nanoleafAuthToken(
    @Root() device: Device,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafAuthToken | null> {
    const nanoleafAuthToken = await prisma.device
      .findUnique({
        where: {
          id: device.id,
        },
      })
      .nanoleafAuthToken();

    return nanoleafAuthToken;
  }

  @FieldResolver(() => NanoleafProperties)
  async nanoleafProperties(
    @Root() device: Device,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafProperties | null> {
    const nanoleafProperties = await prisma.device
      .findUnique({
        where: {
          id: device.id,
        },
      })
      .nanoleafProperties();

    return nanoleafProperties;
  }

  @FieldResolver(() => [Palette])
  async palettes(
    @Root() device: Device,
    @Ctx() { prisma }: Context
  ): Promise<Palette[]> {
    const palettes = await prisma.device
      .findUnique({
        where: {
          id: device.id,
        },
      })
      .palettes();

    return palettes;
  }

  @FieldResolver(() => User)
  async user(
    @Root() device: Device,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.device
      .findUnique({ where: { id: device.id } })
      .user();

    return user;
  }

  @Directive('authenticated')
  @Query(() => [WifiDevice], { description: descriptions.discoverWifiDevices })
  async discoverWifiDevices(): Promise<WifiDevice[]> {
    try {
      const devices = await find();

      return devices;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('authenticated')
  @Query(() => [WifiDevice], {
    description: descriptions.discoverWifiDevicesByType,
  })
  async discoverWifiDevicesByType(
    @Arg('type') type: DeviceType
  ): Promise<WifiDevice[]> {
    try {
      const devices = await this.discoverWifiDevices();

      const filteredDevices = devices.filter((device: WifiDevice) => {
        const match = findeDeviceByType(device, DeviceMacSubstringByType[type]);

        return match;
      });

      return filteredDevices;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Query(() => [Device], { description: descriptions.getAllDevicesByUserId })
  async getAllDevicesByUserId(
    @Ctx() { prisma, user }: Context
  ): Promise<Prisma.Device[]> {
    try {
      console.log(user);
      const devices = await prisma.device.findMany({
        where: {
          userId: user?.id,
        },
      });

      if (!devices.length) {
        throw new UserInputError(JSON.stringify(userErrors.noDevices));
      }

      return devices;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Query(() => Device, {
    description: descriptions.getDeviceById,
    nullable: true,
  })
  async getDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma, user }: Context
  ): Promise<Device | null> {
    try {
      const device = await prisma.device.findUnique({
        where: {
          id,
        },
      });

      if (!device) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(id))
        );
      }

      if (device.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      return device;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean, { description: descriptions.deleteDeviceById })
  async deleteDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      const device = await prisma.device.delete({
        where: {
          id,
        },
      });

      if (!device) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(id))
        );
      }

      if (device.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean, {
    description: descriptions.updateAllDevicePowerByUserId,
  })
  async updateAllDevicePowerByUserId(
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { userId: user?.id },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(JSON.stringify(userErrors.noDevices));
      }

      if (devices[0].userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      devices.forEach(async ({ id, ip, nanoleafAuthToken }) => {
        if (!nanoleafAuthToken) {
          throw new Error(JSON.stringify(deviceErrors.deviceNoAuthToken(id)));
        }

        const stateInput = {
          on: {
            value: isOn.toString(),
          },
        };

        await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);
      });

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean, { description: descriptions.updateDevicePowerById })
  async updateDevicePowerById(
    @Arg('id') id: string,
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      const device = await prisma.device.findUnique({
        where: { id },
        include: { nanoleafAuthToken: true },
      });

      if (!device) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(id))
        );
      }

      if (device.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(JSON.stringify(deviceErrors.deviceNoAuthToken(id)));
      }

      const { ip, nanoleafAuthToken } = device;

      const stateInput = {
        on: {
          value: isOn.toString(),
        },
      };

      await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Boolean, {
    description: descriptions.updateDevicePowerByType,
  })
  async updateDevicePowerByType(
    @Arg('type') type: DeviceType,
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma, user }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { type },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.noDevicesByType(type))
        );
      }

      if (devices[0].userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      devices.forEach(async ({ id, ip, nanoleafAuthToken }) => {
        if (!nanoleafAuthToken) {
          throw new Error(JSON.stringify(deviceErrors.deviceNoAuthToken(id)));
        }

        const stateInput = {
          on: {
            value: isOn.toString(),
          },
        };

        await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);
      });

      return true;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Directive('@authenticated')
  @Mutation(() => Device, {
    description: descriptions.updateDeviceNameById,
    nullable: true,
  })
  async updateDeviceNameById(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() { prisma, user }: Context
  ): Promise<Device | null> {
    try {
      const foundDevice = await prisma.device.findUnique({
        where: {
          id,
        },
      });

      if (!foundDevice) {
        throw new UserInputError(
          JSON.stringify(deviceErrors.deviceNotFound(id))
        );
      }

      if (foundDevice.userId !== user?.id) {
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      const device = await prisma.device.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      return device;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default DeviceResolver;
