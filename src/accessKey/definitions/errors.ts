import { ErrorResponse } from 'types';

const errors: Record<string, ErrorResponse> = {
  expired: {
    status: 400,
    message: 'Access key expired',
    friendlyMessage:
      'This access key is expired. Please reach out to the person who invited you for assistance.',
  },
  notFound: {
    status: 404,
    message: 'Access key does not exists',
    friendlyMessage: 'This access key does not exist or has already been used.',
  },
  wrongEmail: {
    status: 400,
    message: 'Wrong email provided',
    friendlyMessage: 'Incorrect email provided with access key',
  },
  alreadyExists: {
    status: 400,
    message: 'Email already has an access key',
    friendlyMessage:
      'An access key has already been sent to this email address',
  },
};

export default errors;
