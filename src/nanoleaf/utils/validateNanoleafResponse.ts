import {
  UserInputError,
  AuthenticationError,
  ForbiddenError,
} from 'apollo-server';
import { Response } from 'node-fetch';

import { errors } from '../definitions';

const validateNanoleafResponse = (
  response: Response,
  ipAddress: string
): void => {
  if (response.status === 401) {
    throw new AuthenticationError(JSON.stringify(errors.unauthenticated));
  }

  if (response.status === 400) {
    throw new UserInputError(JSON.stringify(errors.badJsonInput(ipAddress)));
  }

  if (response.status === 404) {
    throw new Error(
      JSON.stringify(errors.deviceNotFoundAtIpAddress(ipAddress))
    );
  }

  if (response.status === 403) {
    throw new ForbiddenError(JSON.stringify(errors.authTokenNotRegistered));
  }
};

export default validateNanoleafResponse;
