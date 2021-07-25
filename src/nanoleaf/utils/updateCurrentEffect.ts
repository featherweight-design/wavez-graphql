import fetch from 'node-fetch';

import { constants } from 'nanoleaf/definitions';
import validateNanoleafResponse from './validateNanoleafResponse';

const { endpoints } = constants;

const updateCurrentEffect = async (
  ipAddress: string,
  authToken: string,
  effectName: string
): Promise<void> => {
  try {
    const response = await fetch(
      endpoints.update.effect(ipAddress, authToken),
      {
        method: 'PUT',
        body: JSON.stringify({
          select: effectName,
        }),
      }
    );

    validateNanoleafResponse(response, ipAddress);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default updateCurrentEffect;
