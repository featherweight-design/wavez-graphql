import { ErrorResponse } from 'types';

const errors: Record<string, ErrorResponse> = {
  alreadyExists: {
    status: 400,
    message: 'User by email already exists',
    friendlyMessage:
      'This user already exists. Please sign-in with your existing credentials',
  },
  notAuthenticated: {
    status: 400,
    message: 'User not authenticated',
    friendlyMessage: 'User not authenticated. Please sign in.',
  },
  notAuthorized: {
    status: 401,
    message: 'User not authorized',
    friendlyMessage:
      'User not authorized to access this resource. Please try again.',
  },
  notFound: {
    status: 404,
    message: 'User does not exist',
    friendlyMessage: "We can't find that user. Please try again.",
  },
  noDevices: {
    status: 404,
    message: 'User has no associated devices',
    friendlyMessage:
      "We can't find any devices that belong to that user. Please try again.",
  },
  noInvites: {
    status: 400,
    message: 'User has no invites',
    friendlyMessage:
      'You have no invites left. If you would like more, please contact us.',
  },
};

export default errors;
