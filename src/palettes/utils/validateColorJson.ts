import { UserInputError } from 'apollo-server';
import { errors } from 'palettes/definitions';

import { NanoleafColorResponse } from 'types';

const validateColorJson = (colors: string): NanoleafColorResponse[] => {
  const parsedColors = JSON.parse(colors) as NanoleafColorResponse[];

  parsedColors.forEach(({ hue, saturation, brightness }) => {
    if (
      hue === undefined ||
      saturation === undefined ||
      brightness === undefined
    ) {
      throw new UserInputError(JSON.stringify(errors.paletteInvalidColors));
    }
  });

  return parsedColors;
};

export default validateColorJson;
