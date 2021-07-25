import { ErrorResponse } from 'types';

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
};

export default errors;
