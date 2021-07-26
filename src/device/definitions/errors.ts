import { DeviceType } from '@prisma/client';

import { ErrorResponse } from 'types';

const friendlyDeviceNameMap = {
  [DeviceType.HUE]: 'Philips Hue',
  [DeviceType.LIFX]: 'LIFX',
  [DeviceType.NANOLEAF]: 'Nanoleaf',
};

const errors = {
  deviceNotFound: (deviceId: string): ErrorResponse => ({
    status: 404,
    message: `Device by id ${deviceId} does not exist`,
    friendlyMessage: "We can't find that device. Please try again.",
  }),
  deviceNoAuthToken: (deviceId: string): ErrorResponse => ({
    status: 404,
    message: `Device by id ${deviceId} has no associated authToken`,
    friendlyMessage:
      "It looks like this device hasn't been authenticated. Please try again.",
  }),
  noDevicesByType: (type: DeviceType): ErrorResponse => ({
    status: 404,
    message: `No devices by type ${type} found`,
    friendlyMessage: `It looks like there aren't any saved ${friendlyDeviceNameMap[type]} device hasn't been authenticated. Please try again.`,
  }),
};

export default errors;
