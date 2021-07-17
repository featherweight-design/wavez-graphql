import Prisma from '.prisma/client';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import find from 'local-devices';

import { Context, DeviceMacSubstringByType } from 'types';
import { Device, WifiDevice } from './Device';
import { User } from 'user';
import { DeviceType } from '@prisma/client';

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
}

export default DeviceResolver;
