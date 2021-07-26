import { ErrorResponse } from 'types';

const errors = {
  auth: (status: number): ErrorResponse => ({
    status,
    message: 'Unable to authenticate with Nanoleaf device',
    friendlyMessage:
      'Unable to authenticate with Nanoleaf device. Ensure that your device is ready to authenticate by holding down the power button until the lights start blinking (5-7 seconds).',
  }),
  authTokenNotFound: (id: string): ErrorResponse => ({
    status: 404,
    message: `Nanoleaf authToken by id ${id} not found`,
    friendlyMessage:
      "We can't find a Nanoleaf device with those credentials. Please try again.",
  }),
  authTokenNotRegistered: {
    status: 403,
    message: 'The provided authToken is not registered with this device',
    friendlyMessage:
      "The credentials for this device don't match what we have in our system. Please try again.",
  },
  badJsonInput: (ipAddress: string): ErrorResponse => ({
    status: 400,
    message: 'Bad input to Nanoleaf device',
    friendlyMessage: `Failed to update Nanoleaf device at ipAddress ${ipAddress}. Check all given parameters.`,
  }),
  deviceConflict: (ipAddress: string): ErrorResponse => ({
    status: 409,
    message: `Device conflict by IP Address ${ipAddress}`,
    friendlyMessage: `A device using the IP Address ${ipAddress} already exists.`,
  }),
  deviceNotFoundAtIpAddress: (ipAddress: string): ErrorResponse => ({
    status: 404,
    message: `No device at ipAddress ${ipAddress} was found`,
    friendlyMessage:
      "We couldn't find that device on your current ipAddress. Make sure you connnected to the same WiFi as your devices",
  }),
  unauthenticated: {
    status: 401,
    message: 'Unauthenticated to access device',
    friendltMessage:
      'You are not authenticated to communicate with this device. Please check that you have synced with this device.',
  },
};

export default errors;
