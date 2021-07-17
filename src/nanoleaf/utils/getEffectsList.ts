import fetch from 'node-fetch';

import { constants } from '../definitions';

const { endpoints } = constants;

const getEffectsList = async (
  ipAddress: string,
  authToken: string
): Promise<string[]> => {
  const response = await fetch(endpoints.get.effectsList(ipAddress, authToken));

  const effectsList = (await response.json()) as string[];

  return effectsList;
};

export default getEffectsList;
