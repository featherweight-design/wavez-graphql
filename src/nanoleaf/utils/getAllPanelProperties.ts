import fetch from "node-fetch";
import { NanoleafPanelProps } from "types";

import { constants } from "../definitions";

const { endpoints } = constants;

const getAllPanelProperties = async (
  ipAddress: string,
  authToken: string
): Promise<NanoleafPanelProps> => {
  const response = await fetch(
    endpoints.get.properties(ipAddress, authToken)
  );

  const properties = response.json();

  return properties;
};

export default getAllPanelProperties;
