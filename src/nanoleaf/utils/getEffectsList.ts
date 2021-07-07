import fetch from "node-fetch";

import { constants } from "../definitions";

const { endpoints } = constants;

const getEffectsList = async (ipAddress: string, authToken: string): Promise<string[]> => {
  const response = await fetch(
    endpoints.get.effectsList(ipAddress, authToken)
  );

  const effectsList = response.json();

  return effectsList;
}

export default getEffectsList;