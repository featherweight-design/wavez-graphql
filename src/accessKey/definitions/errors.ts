import { ErrorResponse } from 'types';

const errors: Record<string, ErrorResponse> = {
  notFound: {
    status: 404,
    message: 'Access key does not exists',
    friendlyMessage: 'This access key does not exist or has already been used.',
  },
};

export default errors;
