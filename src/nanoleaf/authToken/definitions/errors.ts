import { ErrorResponse } from 'types';

const errors = {
  authTokenNotFound: (id: string): ErrorResponse => ({
    status: 404,
    message: `Nanoleaf authTokeb by id ${id} not found`,
    friendlyMessage:
      "We can't find a Nanoleaf device with those credentials. Please try again.",
  }),
};

export default errors;
