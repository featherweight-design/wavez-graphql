import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import dotenv from 'dotenv';
import { buildSchemaSync } from 'type-graphql';

import { Context } from 'types';
import { DeviceResolver } from 'device';
import { NanoleafAuthTokenResolver, NanoleafStateResolver } from 'nanoleaf';
import { PaletteResolver } from 'palettes';
import { UserResolver } from 'user';
import { createToken, getUserFromToken } from 'utils';

dotenv.config({ path: `${__dirname}/.env` });

const PORT = process.env.PORT || 4000;
const prisma = new PrismaClient();

const schema = buildSchemaSync({
  // emitSchemaFile: true,
  resolvers: [
    DeviceResolver,
    NanoleafAuthTokenResolver,
    NanoleafStateResolver,
    PaletteResolver,
    UserResolver,
  ],
});
const server = new ApolloServer({
  schema,
  //* Prisma must be privided to other resolvers through context
  context: async ({ req }): Promise<Context> => ({
    prisma,
    user: await getUserFromToken(prisma, req.headers.authorization),
    createToken,
  }),
});

void server.listen(PORT, () =>
  console.log(`🚀  Server running on http://localhost:${PORT}/graphql`)
);
