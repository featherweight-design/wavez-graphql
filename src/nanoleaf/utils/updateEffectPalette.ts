import fetch from 'node-fetch';

import { constants } from 'nanoleaf/definitions';
import { NanoLeafAnimationResponse } from 'types';
import { validateColorJson } from 'palettes/utils';
import getEffectDetailsByName from './getEffectDetailsByName';
import validateNanoleafResponse from './validateNanoleafResponse';

const { endpoints } = constants;

interface UpdateEffectPaletteArgs {
  authToken: string;
  colors: string;
  ipAddress: string;
  paletteName: string;
}

/** Example body request
 * {
 *   command: 'add',
 *   version: '2.0',
 *   animName: 'Aquarium',
 *   animType: 'plugin',
 *   colorType: 'HSB',
 *   palette: [ { hue: 198, saturation: 46, brightness: 100, probability: 0 } ],
 *   pluginType: 'color',
 *   pluginUuid: 'ba632d3e-9c2b-4413-a965-510c839b3f71',
 *   pluginOptions: [
 *     { name: 'delayTime', value: 20 },
 *     { name: 'transTime', value: 46 }
 *   ],
 *   hasOverlay: false
 * }
 * {
 *   version: '2.0',
 *   animName: 'Aquarium',
 *   animType: 'plugin',
 *   colorType: 'HSB',
 *   palette: [ { hue: 198, saturation: 46, brightness: 100, probability: 0 } ],
 *   pluginType: 'color',
 *   pluginUuid: 'ba632d3e-9c2b-4413-a965-510c839b3f71',
 *   pluginOptions: [
 *     { name: 'delayTime', value: 20 },
 *     { name: 'transTime', value: 46 }
 *   ],
 *   hasOverlay: false
 * }
 */

const updateEffectPalette = async ({
  authToken,
  colors,
  ipAddress,
  paletteName,
}: UpdateEffectPaletteArgs): Promise<void> => {
  try {
    //* Validate colors to have { hue, saturation, brightness }
    const parsedColors = validateColorJson(colors);

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
    const response = await fetch(
      endpoints.update.effect(ipAddress, authToken),
      {
        method: 'PUT',
        body: JSON.stringify({
          write: {
            command: 'add',
            ...updatedEffectProperties,
            loop: true,
          },
        }),
      }
    );

    validateNanoleafResponse(response, ipAddress);
  } catch (error) {
    console.error(error);

    throw error;
  }
};

export default updateEffectPalette;
