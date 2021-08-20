// Disabled because of required directive typings with any
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AuthenticationError,
  // ForbiddenError,
  SchemaDirectiveVisitor,
} from 'apollo-server';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';

import { Context } from 'types';
import { errors as userErrors } from 'user/definitions';

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<any, any>
  ): GraphQLField<any, any> | void | null {
    // Grab the user from the context
    const { resolve = defaultFieldResolver } = field;

    field.resolve = (
      root,
      args,
      context,
      info
    ): GraphQLFieldResolver<typeof root, typeof context> => {
      if (!(context as Context).user) {
        // If the user isn't there throw an error
        throw new AuthenticationError(
          JSON.stringify(userErrors.userNotAuthenticated)
        );
      }

      return resolve(root, args, context, info) as GraphQLFieldResolver<
        typeof root,
        typeof context
      >;
    };
  }
}

// class AuthorizationDirective extends SchemaDirectiveVisitor {
//   visitFieldDefinition(field) {
//     const resolver = field.resolve || defaultFieldResolver;
//     // Grab the role for this.args and compare against user.role
//     const { role } = this.args;

//     field.resolve = async (root, args, context, info) => {
//       if (context.user.role !== role) {
//         // If user.role isn't there throw an error
//         throw new ForbiddenError(`Not authorized, must be role of ${role}`);
//       }

//       return resolver(root, args, context, info);
//     };
//   }
// }

export { AuthenticationDirective };
