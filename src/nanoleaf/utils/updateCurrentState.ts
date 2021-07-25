import fetch from 'node-fetch';

import { constants } from 'nanoleaf/definitions';
import { NanoleafStateInput } from 'nanoleaf/NanoleafInputs';
import validateNanoleafResponse from './validateNanoleafResponse';

const { endpoints } = constants;

/**
 * Type GraphQL does not allow union types for inputs, so
 * we need to pass a string of "true" to update the "on"
 * state. This converts it to a boolen for the Nanoleaf API.
 * See: https://github.com/MichalLytek/type-graphql/issues/384
 */
const checkForOnState = (body: NanoleafStateInput) => {
  if (body.on) {
    return {
      on: {
        value: body.on.value === 'true',
      },
    };
  }

  return body;
};

const updateCurrentState = async (
  ipAddress: string,
  authToken: string,
  body: NanoleafStateInput
): Promise<void> => {
  try {
    const response = await fetch(endpoints.update.state(ipAddress, authToken), {
      method: 'PUT',
      body: JSON.stringify(checkForOnState(body)),
    });

    validateNanoleafResponse(response, ipAddress);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default updateCurrentState;
