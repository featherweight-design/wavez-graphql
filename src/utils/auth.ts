import { PrismaClient } from '@prisma/client';
// import { AuthenticationError, ForbiddenError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { UserJwtPayload } from 'types';
import { User } from 'user';

const TOKEN_TTL = '2d';

/**
 * takes a user object and creates  jwt out of it
 * using user.id and user.role
 * @param {Object} user the user to create a jwt for
 */
const createToken = ({ id, role }: User): string =>
  jwt.sign({ id, role }, process.env.SECRET, { expiresIn: TOKEN_TTL });

/**
 * will attemp to verify a jwt and find a user in the
 * db associated with it. Catches any error and returns
 * a null user
 * @param {String} token jwt from client
 */
const getUserFromToken = async (
  prisma: PrismaClient,
  token?: string
): Promise<User | null> => {
  if (!token) {
    return null;
  }

  try {
    const userPayload = jwt.verify(token, process.env.SECRET) as UserJwtPayload;

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.id,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
};

// /**
//  * checks if the user is on the context object
//  * continues to the next resolver if true
//  * @param {Function} next next resolver function ro run
//  */
// const authenticated = next => (root, args, context, info) => {
//   if (!context.user) {
//     throw new AuthenticationError('Not authenticated');
//   }

//   return next(root, args, context, info);
// };

// /**
//  * checks if the user on the context has the specified role.
//  * continues to the next resolver if true
//  * @param {String} role enum role to check for
//  * @param {Function} next next resolver function to run
//  */
// const authorized = (role, next) => (root, args, context, info) => {
//   if (context.user.role !== role) {
//     throw new ForbiddenError(`Not authorized, must be role of ${role}`);
//   }

//   return next(root, args, context, info);
// };

export {
  // authenticated,
  // authorized,
  createToken,
  getUserFromToken,
};
