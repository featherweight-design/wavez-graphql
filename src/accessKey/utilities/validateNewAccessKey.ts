import { PrismaClient } from '@prisma/client';
import { UserInputError } from 'apollo-server';

import { errors as userErrors } from 'user/definitions';
import { errors } from '../definitions';

const validateNewAccessKey = async (
  prisma: PrismaClient,
  email: string
): Promise<void> => {
  //* Check if email is already used
  const doesUserExist = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (doesUserExist) {
    throw new UserInputError(JSON.stringify(userErrors.alreadyExists));
  }

  //* Check is user has already been sent an access key
  const doesAccessKeyExistByEmail = await prisma.accessKey.findUnique({
    where: {
      email,
    },
  });

  if (doesAccessKeyExistByEmail) {
    throw new UserInputError(JSON.stringify(errors.alreadyExists));
  }
};

export default validateNewAccessKey;
