import fetch from 'node-fetch';

import { NanoleafAllEffectsResponse, NanoLeafAnimationResponse } from 'types';
import { constants } from '../definitions';

const { endpoints } = constants;

/** Example body request
 * {
 *  "command": "requestAll",
 * }
 */

const getAllEffectsDetails = async (
  ipAddress: string,
  authToken: string
): Promise<NanoLeafAnimationResponse[]> => {
  try {
    const response = await fetch(endpoints.get.effects(ipAddress, authToken), {
      method: 'PUT',
      body: JSON.stringify({
        write: {
          command: 'requestAll',
        },
      }),
    });

    const properties = (await response.json()) as NanoleafAllEffectsResponse;

    return properties.animations;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default getAllEffectsDetails;
