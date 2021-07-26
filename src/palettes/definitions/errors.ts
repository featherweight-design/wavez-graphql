import { ErrorResponse } from 'types';

const errors = {
  paletteNotFound: (id: string): ErrorResponse => ({
    status: 404,
    message: `Palette by id ${id} does not exist`,
    friendlyMessage: "We can't find that palette. Please try again.",
  }),
  paletteNoDevices: (id: string): ErrorResponse => ({
    status: 404,
    message: `Palette by id ${id} does not have any associated devices`,
    friendlyMessage: "We can't find any devices associated with this palette.",
  }),
  paletteInvalidColors: {
    status: 400,
    message: 'Provided "colors" input is invalid',
    friendlyMessage:
      'At least one color is not valid. Ensure that each color has { hue, saturation, brightness }',
  },
};

export default errors;
