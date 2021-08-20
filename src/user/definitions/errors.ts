import { ErrorResponse } from 'types';

const errors = {
  userAlreadyExists: {
    status: 400,
    message: 'User by email already exists',
    friendlyMessage:
      'This user already exists. Please sign-in with your existing credentials',
  },
  userNotAuthenticated: {
    status: 400,
    message: 'User not authenticated',
    friendlyMessage: 'User not authenticated. Please sign in.',
  },
  userNotAuthorized: {
    status: 401,
    message: 'User not authorized',
    friendlyMessage:
      'User not authorized to access this resource. Please try again.',
  },
  userNotFound: (userId: string): ErrorResponse => ({
    status: 404,
    message: `User by id ${userId} does not exist`,
    friendlyMessage: "We can't find that user. Please try again.",
  }),
  userNoDevices: {
    status: 404,
    message: 'User has no associated devices',
    friendlyMessage:
      "We can't find any devices that belong to that user. Please try again.",
  },
};

export default errors;
