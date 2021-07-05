import { PrismaClient } from "@prisma/client";
import { Context as ApolloContext } from "apollo-server-core";

export interface Context extends ApolloContext {
  prisma: PrismaClient;
}

export enum DeviceMacSubstringByType {
  NANOLEAF = "02:55:da",
  LIFX = "d0:73:d5",
  HUE = "ECB5",
}
