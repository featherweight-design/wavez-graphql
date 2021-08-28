const descriptions = {
  getAllUsers: '(ADMIN) Returns a list of all users',
  getCurrentUser: 'Returns the currently authenticated user',
  signIn: 'Returns the currently authenticated user and a new JWT',
  signUp:
    'Returns a newly created user and JWT. Requires an existing, valid access key associated with a given email.',
  updateUser:
    'Updates non-restricted properties on the currently authenticated user',
  updateUserById: '(ADMIN) Updates a given user by ID',
};

const copy = { descriptions };

export default copy;
