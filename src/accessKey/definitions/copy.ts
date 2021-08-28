const descriptions = {
  createAccessKey: '(ADMIN) Creates a new access key with a given email',
  deleteAccessKeyById: '(ADMIN) Deletes an access key by a given ID',
  findAccessKeyByEmail:
    'Returns true if an access key by a given email is found. Used when someone attempts to login to the client via Auth0, but does not have an existing account.',
  inviteByEmail:
    '(SUPPORTER) If the given user has invites available, creates a new access key and sends an invite to the given email.',
};

const copy = { descriptions };

export default copy;
