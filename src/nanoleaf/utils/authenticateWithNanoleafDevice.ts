import fetch from 'node-fetch';

import { NanoleafAuthenticationResponse } from 'types';
import { constants } from '../definitions';
import validateNanoleafResponse from './validateNanoleafResponse';

const { endpoints } = constants;

const authenticateWithNanoleafDevice = async (
  ipAddress: string
): Promise<string> => {
  try {
    const response = await fetch(endpoints.authenticate(ipAddress), {
      method: 'POST',
    });

    validateNanoleafResponse(response, ipAddress);

    const { auth_token: authToken } =
      (await response.json()) as NanoleafAuthenticationResponse;

    return authToken;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default authenticateWithNanoleafDevice;
