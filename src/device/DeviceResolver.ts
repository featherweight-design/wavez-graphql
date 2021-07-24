import Prisma from '.prisma/client';
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

import { Context, DeviceMacSubstringByType } from 'types';
import { Device, WifiDevice } from './Device';
import { User } from 'user';
import { DeviceType } from '@prisma/client';
import { Palette } from 'palettes';

const findeDeviceByType = (device: WifiDevice, macSubstring: string) =>
  device.mac.toLocaleLowerCase().includes(macSubstring.toLocaleLowerCase());

@Resolver(Device)
class DeviceResolver {
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

  @Query(() => [WifiDevice])
  async discoverWifiDevices(): Promise<WifiDevice[]> {
    const devices = await find();

    return devices;
  }

  @Query(() => [WifiDevice])
  async discoverWifiDevicesByType(
    @Arg('type') type: DeviceType
  ): Promise<WifiDevice[]> {
    const devices = await this.discoverWifiDevices();

    const filteredDevices = devices.filter((device: WifiDevice) => {
      const match = findeDeviceByType(device, DeviceMacSubstringByType[type]);

      return match;
    });

    return filteredDevices;
  }

  @Query(() => [Device])
  async getAllDevicesByUserId(
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<Prisma.Device[]> {
    const devices = await prisma.device.findMany({
      where: {
        userId,
      },
    });

    return devices;
  }

  @Query(() => Device, { nullable: true })
  async getDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    const device = await prisma.device.findUnique({
      where: {
        id,
      },
    });

    return device;
  }

  @Mutation(() => Device, { nullable: true })
  async updateDeviceNameById(
    @Arg('id') id: string,
    @Arg('name') name: string,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    const device = await prisma.device.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    return device;
  }

  @Mutation(() => Boolean)
  async deleteDeviceById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    try {
      await prisma.device.delete({
        where: {
          id,
        },
      });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}

export default DeviceResolver;
