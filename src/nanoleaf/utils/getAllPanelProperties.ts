import fetch from "node-fetch";
import { NanoleafPanelGetResponse } from "types";

import { constants } from "../definitions";

const { endpoints } = constants;

const getAllPanelProperties = async (
  ipAddress: string,
  authToken: string
): Promise<NanoleafPanelGetResponse> => {
  const response = await fetch(
    endpoints.getAllProperties(ipAddress, authToken)
  );

  const properties = response.json();

  return properties;
};

export default getAllPanelProperties;
