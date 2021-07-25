import { UserInputError } from 'apollo-server';

import { NanoleafColorResponse } from 'types';

const validateColorJson = (colors: string): NanoleafColorResponse[] => {
  const parsedColors = JSON.parse(colors) as NanoleafColorResponse[];

  parsedColors.forEach(({ hue, saturation, brightness }) => {
    if (
      hue === undefined ||
      saturation === undefined ||
      brightness === undefined
    ) {
      throw new UserInputError(
        'User input of "colors" is not valid. Ensure that each color has { hue, saturation, brightness }'
      );
    }
  });

  return parsedColors;
};

export default validateColorJson;
