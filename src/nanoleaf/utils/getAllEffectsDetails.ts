import fetch from 'node-fetch';
import { NanoleafAllEffectsResponse } from 'types';

import { constants } from '../definitions';

const { endpoints } = constants;

const getAllEffectsDetails = async (
  ipAddress: string,
  authToken: string
): Promise<NanoleafAllEffectsResponse> => {
  const response = await fetch(endpoints.get.effects(ipAddress, authToken), {
    method: 'PUT',
    body: JSON.stringify({
      write: {
        command: 'requestAll',
      },
    }),
  });

  const properties = (await response.json()) as NanoleafAllEffectsResponse;

  return properties;
};

export default getAllEffectsDetails;
