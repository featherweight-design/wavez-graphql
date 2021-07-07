import { NanoleafStateProps } from "types";
import { constants } from "nanoleaf/definitions";

const { endpoints } = constants;

const updateCurrentState = async (
  ipAddress: string,
  authToken: string,
  body: NanoleafStateProps
): Promise<void> => {
  try {
    await fetch(endpoints.update.state(ipAddress, authToken), {
      method: "PUT",
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(error);
  }
};

export default updateCurrentState;
