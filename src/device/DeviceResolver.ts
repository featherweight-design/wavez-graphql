import Prisma, { DeviceType } from '@prisma/client';
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
import find from 'local-devices';

import { NanoleafAuthToken, NanoleafProperties } from 'nanoleaf';
import { Palette } from 'palettes';
import { Context, DeviceMacSubstringByType } from 'types';
import { User } from 'user';
import { updateCurrentState } from 'nanoleaf/utils';
import { errors as userErrors } from 'user/definitions';
import { Device, WifiDevice } from './Device';

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

  @Query(() => [WifiDevice])
  async discoverWifiDevices(): Promise<WifiDevice[]> {
    try {
      const devices = await find();

      return devices;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Query(() => [WifiDevice])
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

  @Query(() => [Device])
  async getAllDevicesByUserId(
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<Prisma.Device[]> {
    try {
      const devices = await prisma.device.findMany({
        where: {
          userId,
        },
      });

      if (!devices.length) {
        throw new UserInputError(
          JSON.stringify(userErrors.userNoDevices(userId))
        );
      }

      return devices;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Query(() => Device, { nullable: true })
  async getDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    try {
      const device = await prisma.device.findUnique({
        where: {
          id,
        },
      });

      if (!device) {
        throw new UserInputError(`Device by id ${id} does not exist`);
      }

      return device;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => String)
  async deleteDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    try {
      const device = await prisma.device.delete({
        where: {
          id,
        },
      });

      if (!device) {
        throw new UserInputError(`Device by id ${id} does not exist`);
      }

      return id;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  @Mutation(() => Boolean)
  async updateAllDevicePowerByUserId(
    @Arg('userId') userId: string,
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { userId: userId },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(
          JSON.stringify(userErrors.userNoDevices(userId))
        );
      }

      devices.forEach(async ({ id, ip, nanoleafAuthToken }) => {
        if (!nanoleafAuthToken) {
          throw new Error(
            `Device by id ${id} does not have an associated auth token`
          );
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

  @Mutation(() => Boolean)
  async updateDevicePowerById(
    @Arg('id') id: string,
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const device = await prisma.device.findUnique({
        where: { id },
        include: { nanoleafAuthToken: true },
      });

      if (!device) {
        throw new UserInputError(`Device by id ${id} does no exist`);
      }

      if (!device.nanoleafAuthToken) {
        throw new Error(
          `Device by id ${id} does not have an associated auth token`
        );
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

  @Mutation(() => Boolean)
  async updateDevicePowerByType(
    @Arg('type') type: DeviceType,
    @Arg('isOn') isOn: boolean,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      const devices = await prisma.device.findMany({
        where: { type },
        include: { nanoleafAuthToken: true },
      });

      if (!devices.length) {
        throw new UserInputError(`Devices by type ${type} do not exist`);
      }

      devices.forEach(async ({ id, ip, nanoleafAuthToken }) => {
        if (!nanoleafAuthToken) {
          throw new Error(
            `Device by id ${id} does not have an associated auth token`
          );
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

  @Mutation(() => Device, { nullable: true })
  async updateDeviceNameById(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    try {
      const device = await prisma.device.update({
        where: {
          id,
        },
        data: {
          name,
        },
      });

      if (!device) {
        throw new UserInputError(`Device by id ${id} does not exist`);
      }

      return device;
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}

export default DeviceResolver;
