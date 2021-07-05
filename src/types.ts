import { PrismaClient } from "@prisma/client";
import { Context as ApolloContext } from 'apollo-server-core';

export interface Context extends ApolloContext {
  prisma: PrismaClient;
}