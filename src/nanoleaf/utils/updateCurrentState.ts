import { NanoleafStateProps } from "types";
import { constants } from "nanoleaf/definitions";

const { endpoints } = constants;

/**
 * Type GraphQL does not allow union types for inputs, so
 * we need to pass a string of "true" to update the "on"
 * state. This converts it to a boolen for the Nanoleaf API.
 * See: https://github.com/MichalLytek/type-graphql/issues/384
 */
const checkForOnState = (body: NanoleafStateProps) => {
  if (body.on) {
    return {
      on: {
        value: body.on.value === "true",
      },
    };
  }

  return body;
};

const updateCurrentState = async (
  ipAddress: string,
  authToken: string,
  body: NanoleafStateProps
): Promise<void> => {
  try {
    await fetch(endpoints.update.state(ipAddress, authToken), {
      method: "PUT",
      body: JSON.stringify(checkForOnState(body)),
    });
  } catch (error) {
    console.error(error);
  }
};

export default updateCurrentState;
