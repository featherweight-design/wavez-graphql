import fetch from 'node-fetch';
import { NanoleafPropertiesProps } from 'types';

import { constants } from '../definitions';

const { endpoints } = constants;

const getAllPanelProperties = async (
  ipAddress: string,
  authToken: string
): Promise<NanoleafPropertiesProps> => {
  try {
    const response = await fetch(
      endpoints.get.properties(ipAddress, authToken)
    );

    const properties = (await response.json()) as NanoleafPropertiesProps;

    return properties;
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default getAllPanelProperties;
