import fetch from 'node-fetch';

import { constants } from 'nanoleaf/definitions';

const { endpoints } = constants;

const updateCurrentEffect = async (
  ipAddress: string,
  authToken: string,
  effectName: string
): Promise<void> => {
  try {
    await fetch(endpoints.update.effect(ipAddress, authToken), {
      method: 'PUT',
      body: JSON.stringify({
        select: effectName,
      }),
    });
  } catch (error) {
    throw new Error(error);
  }
};

export default updateCurrentEffect;
