import { UserInputError, AuthenticationError } from 'apollo-server';
import { Response } from 'node-fetch';

const validateNanoleafResponse = (
  response: Response,
  ipAddress: string
): void => {
  if (response.status === 401) {
    throw new AuthenticationError(
      'User is not authenticated to communicate with this device. Please check the give ipAddress and authToken.'
    );
  }

  if (response.status === 400) {
    throw new UserInputError(
      `Failed to update effect on Nanoleaf device at IP Address ${ipAddress}. Check all given parameters.`,
      response
    );
  }

  if (response.status === 404) {
    throw new Error(`No device at ipAddress ${ipAddress} was found`);
  }
};

export default validateNanoleafResponse;
