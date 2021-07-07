import { constants } from "nanoleaf/definitions";

const { endpoints } = constants;

interface UpdateCurrentEffectRequestBody {
  select: string;
}

const updateCurrentEffect = async (
  ipAddress: string,
  authToken: string,
  body: UpdateCurrentEffectRequestBody
): Promise<void> => {
  try {
    await fetch(endpoints.update.effect(ipAddress, authToken), {
      method: "PUT",
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(error);
  }
};

export default updateCurrentEffect;