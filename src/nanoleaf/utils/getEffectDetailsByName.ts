import fetch from 'node-fetch';

import { NanoLeafAnimationResponse } from 'types';
import { constants } from '../definitions';

const { endpoints } = constants;

/** Example body request
 * {
 *  "command": "request",
 *  "animName": "My Animation",
 * }
 */

const getEffectDetailsByName = async (
  authToken: string,
  ipAddress: string,
  paletteName: string
): Promise<NanoLeafAnimationResponse> => {
  try {
    const response = await fetch(endpoints.get.effects(ipAddress, authToken), {
      method: 'PUT',
      body: JSON.stringify({
        write: {
          command: 'request',
          animName: paletteName,
        },
      }),
    });

    const properties = (await response.json()) as NanoLeafAnimationResponse;

    return properties;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default getEffectDetailsByName;
