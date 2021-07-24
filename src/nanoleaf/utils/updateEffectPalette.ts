import fetch from 'node-fetch';
import { UserInputError } from 'apollo-server';

import { constants } from 'nanoleaf/definitions';
import { NanoleafColorResponse, NanoLeafAnimationResponse } from 'types';
import getEffectDetailsByName from './getEffectDetailsByName';

const { endpoints } = constants;

interface UpdateEffectPaletteArgs {
  authToken: string;
  colors: string;
  ipAddress: string;
  paletteName: string;
}

/** Example body request
 * {
 *  "command": "rename",
 *  "animName": "My Flow Animation",
 *  "newName": "My New Flow Animation"
 * }
 */

const validateColors = (colors: NanoleafColorResponse[]): boolean => {
  let isValid = true;

  colors.forEach(({ hue, saturation, brightness }) => {
    if (!hue || !saturation || !brightness) {
      isValid = false;
    }
  });

  return isValid;
};

const updateEffectPalette = async ({
  authToken,
  colors,
  ipAddress,
  paletteName,
}: UpdateEffectPaletteArgs): Promise<void> => {
  try {
    //* Validate colors to have { hue, saturation, brightness }
    const parsedColors = JSON.parse(colors) as NanoleafColorResponse[];
    const isValid = validateColors(parsedColors);

    if (!isValid) {
      throw new UserInputError(
        'User input of "colors" is not valid. Ensure that each color has { hue, saturation, brightness }'
      );
    }

    //* Get existing effect from device
    const existingEffectProperties = await getEffectDetailsByName(
      authToken,
      ipAddress,
      paletteName
    );

    //* Update existing effect with new colors
    const updatedEffectProperties: NanoLeafAnimationResponse = {
      ...existingEffectProperties,
      palette: parsedColors,
    };

    //* Update effect with Nanoleaf device
    await fetch(endpoints.update.effect(ipAddress, authToken), {
      method: 'PUT',
      body: JSON.stringify({
        write: {
          command: 'update',
          ...updatedEffectProperties,
        },
      }),
    });
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default updateEffectPalette;
