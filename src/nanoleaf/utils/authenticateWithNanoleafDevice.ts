import { UserInputError } from 'apollo-server';
import fetch from 'node-fetch';

import { NanoleafAuthenticationResponse } from 'types';
import { constants, errors } from '../definitions';

const { endpoints } = constants;

const authenticateWithNanoleafDevice = async (
  ipAddress: string
): Promise<string> => {
  const response = await fetch(endpoints.authenticate(ipAddress), {
    method: 'POST',
  });

  if (!response.ok && (response.status === 401 || response.status === 403)) {
    const error = errors.auth(response.status);

    throw new UserInputError(error.message, error);
  }

  const { auth_token: authToken }: NanoleafAuthenticationResponse =
    await response.json();

  return authToken;
};

export default authenticateWithNanoleafDevice;
