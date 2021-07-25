import fetch from 'node-fetch';

import { constants } from 'nanoleaf/definitions';
import validateNanoleafResponse from './validateNanoleafResponse';

const { endpoints } = constants;

interface UpdateEffectNameArgs {
  ipAddress: string;
  authToken: string;
  existingName: string;
  newName: string;
}

/** Example body request
 * {
 *  "command": "rename",
 *  "animName": "My Flow Animation",
 *  "newName": "My New Flow Animation"
 * }
 */

const updateEffectName = async ({
  existingName,
  authToken,
  ipAddress,
  newName,
}: UpdateEffectNameArgs): Promise<void> => {
  try {
    const response = await fetch(
      endpoints.update.effect(ipAddress, authToken),
      {
        method: 'PUT',
        body: JSON.stringify({
          write: {
            command: 'rename',
            animName: existingName,
            newName,
          },
        }),
      }
    );

    validateNanoleafResponse(response, ipAddress);
  } catch (error) {
    throw new Error(error);
  }
};

export default updateEffectName;
