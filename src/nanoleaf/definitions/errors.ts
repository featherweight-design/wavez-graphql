import { ErrorResponse } from 'types';

const errors = {
  auth: (status: number): ErrorResponse => ({
    status,
    message: 'Unable to authenticate with Nanoleaf device',
    friendlyMessage:
      'Unable to authenticate with Nanoleaf device. Ensure that your device is ready to authenticate by holding down the power button until the lights start blinking (5-7 seconds).',
  }),
  deviceConflict: (ipAddress: string): ErrorResponse => ({
    status: 409,
    message: `Device conflict by IP Address ${ipAddress}`,
    friendlyMessage: `A device using the IP Address ${ipAddress} already exists.`,
  }),
};

export default errors;
