import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { buildSchemaSync } from 'type-graphql';

import { Context } from 'types';
import { DeviceResolver } from 'device';
import {
  NanoleafAuthTokenResolver,
  NanoleafPropertiesResolver,
  NanoleafStateResolver,
} from 'nanoleaf';
import { PaletteResolver } from 'palettes';
import { UserResolver } from 'user';

const PORT = 4000;
const prisma = new PrismaClient();

const schema = buildSchemaSync({
  // emitSchemaFile: true,
  resolvers: [
    DeviceResolver,
    NanoleafAuthTokenResolver,
    NanoleafPropertiesResolver,
    NanoleafStateResolver,
    PaletteResolver,
    UserResolver,
  ],
});
const server = new ApolloServer({
  schema,
  //* Prisma must be privided to other resolvers through context
  context: (): Context => ({ prisma }),
});

void server.listen(PORT, () =>
  console.log(`🚀  Server running on http://localhost:${PORT}/graphql`)
);
