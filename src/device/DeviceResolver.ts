import { Query, Resolver } from "type-graphql";
import find from "local-devices";

import Device, { WifiDevice } from "./Device";

@Resolver(Device)
class DeviceResolver {
  @Query(() => [WifiDevice])
  async discoverWifiDevices(): Promise<WifiDevice[]> {
    const devices = await find();

    return devices;
  }
}

export default DeviceResolver;
