import { DeviceType } from '@prisma/client';
import { Arg, Query, Resolver } from 'type-graphql';
import find from 'local-devices';

import { DeviceMacSubstringByType } from 'types';
import Device, { WifiDevice } from './Device';

const findeDeviceByType = (device: WifiDevice, macSubstring: string) =>
  device.mac.toLocaleLowerCase().includes(macSubstring.toLocaleLowerCase());

@Resolver(Device)
class DeviceResolver {
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
}

export default DeviceResolver;
