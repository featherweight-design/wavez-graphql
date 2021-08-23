// Disabled because of required directive typings with any
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Role } from '@prisma/client';
import {
  AuthenticationError,
  ForbiddenError,
  SchemaDirectiveVisitor,
} from 'apollo-server';
import {
  defaultFieldResolver,
  GraphQLField,
  GraphQLFieldResolver,
} from 'graphql';

import { Context, RoleEnum } from 'types';
import { User } from 'user';
import { errors as userErrors } from 'user/definitions';

const ROLES_HIERARCY: Role[] = [
  RoleEnum.BASIC,
  RoleEnum.BETA,
  RoleEnum.ALPHA,
  RoleEnum.SUPPORTER,
  RoleEnum.ADMIN,
];

class AuthenticationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<any, any>
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;

    field.resolve = (
      root,
      args,
      context: Context,
      info
    ): GraphQLFieldResolver<typeof root, typeof context> => {
      if (!context.user) {
        // If the user isn't there throw an error
        throw new AuthenticationError(
          JSON.stringify(userErrors.notAuthenticated)
        );
      }

      return resolve(root, args, context, info) as GraphQLFieldResolver<
        typeof root,
        typeof context
      >;
    };
  }
}

class AuthorizationDirective extends SchemaDirectiveVisitor {
  visitFieldDefinition(
    field: GraphQLField<any, any>
  ): GraphQLField<any, any> | void | null {
    const { resolve = defaultFieldResolver } = field;

    // Grab the role for this.args and compare against user.role
    const { role } = this.args;
    const authorizationHierarchy = ROLES_HIERARCY.indexOf(role);

    field.resolve = (
      root,
      args,
      context,
      info
    ): GraphQLFieldResolver<typeof root, typeof context> => {
      const { user } = context as Context;
      const userRoleHierarcy = ROLES_HIERARCY.indexOf((user as User)?.role);

      if (userRoleHierarcy < authorizationHierarchy) {
        // If user.role isn't there throw an error
        throw new ForbiddenError(JSON.stringify(userErrors.notAuthorized));
      }

      return resolve(root, args, context, info) as GraphQLFieldResolver<
        typeof root,
        typeof context
      >;
    };
  }
}

export { AuthenticationDirective, AuthorizationDirective };
