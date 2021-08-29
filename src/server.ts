import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer, SchemaDirectiveVisitor } from 'apollo-server';
import { ApolloServer as ApolloServerLambda } from 'apollo-server-lambda';
import dotenv from 'dotenv';
import { buildSchemaSync } from 'type-graphql';

import { Context } from 'types';
import { AccessKeyResolver } from 'accessKey';
import { DeviceResolver } from 'device';
import { AuthenticationDirective, AuthorizationDirective } from 'directives';
import { NanoleafAuthTokenResolver, NanoleafStateResolver } from 'nanoleaf';
import { PaletteResolver } from 'palettes';
import { UserResolver } from 'user';
import { createToken, getUserFromToken } from 'utils';

dotenv.config({ path: `${__dirname}/.env` });

const prisma = new PrismaClient();

const schema = buildSchemaSync({
  // emitSchemaFile: true,
  resolvers: [
    AccessKeyResolver,
    DeviceResolver,
    NanoleafAuthTokenResolver,
    NanoleafStateResolver,
    PaletteResolver,
    UserResolver,
  ],
});

// Because the schema is built by TypeGraphQL, we need to register
// any directives through apollo-server using the below
SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
  authenticated: AuthenticationDirective,
  authorized: AuthorizationDirective,
});

const createLocalServer = (): typeof ApolloServer.prototype =>
  new ApolloServer({
    // cors: {
    //   allowedHeaders: 'Authorization',
    //   credentials: true,
    //   methods: 'POST',
    //   origin: process.env.ORIGIN,
    // },
    schema,
    //* Prisma must be privided to other resolvers through context
    context: async ({ req }): Promise<Context> => ({
      prisma,
      user: await getUserFromToken(prisma, req.headers.authorization),
      createToken,
    }),
  });

const createLambdaServer = (): typeof ApolloServerLambda.prototype =>
  new ApolloServerLambda({
    schema,
    //* Prisma must be privided to other resolvers through context
    context: async ({ express }): Promise<Context> => ({
      prisma,
      user: await getUserFromToken(prisma, express.req.headers.authorization),
      createToken,
    }),
  });

export { createLambdaServer, createLocalServer };

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
// exports.graphqlHandler = server.createHandler();
