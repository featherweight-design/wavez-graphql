import { ErrorResponse } from 'types';

const errors = {
  userNoFound: (userId: string): ErrorResponse => ({
    status: 404,
    message: `User by id ${userId} does not exist`,
    friendlyMessage: "We can't find that user. Please try again.",
  }),
  userNoDevices: (userId: string): ErrorResponse => ({
    status: 404,
    message: `User by id ${userId} has no associated devices`,
    friendlyMessage:
      "We can't find any devices that belong to that user. Please try again.",
  }),
};

export default errors;
