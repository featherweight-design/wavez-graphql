import { PrismaClient } from '@prisma/client';
import { Context as ApolloContext } from 'apollo-server-core';

export interface Context extends ApolloContext {
  prisma: PrismaClient;
}

export enum DeviceMacSubstringByType {
  NANOLEAF = '02:55:da',
  LIFX = 'd0:73:d5',
  HUE = 'ECB5',
}

export interface NanoleafAuthenticationResponse {
  auth_token: string;
}

export interface NanoleafPanelProps {
  firmwareVersion: string;
  name: string;
  model: string;
  serialNo: string;
  effects: NanoleafEffectsProps;
}

export interface NanoleafEffectsProps {
  select: string;
  effectsList: string[];
}

export interface NanoleafStateValueProps {
  value: string | boolean;
  min?: string;
  max?: string;
}

export interface NanoleafStateProps {
  on?: NanoleafStateValueProps;
  brightness?: NanoleafStateValueProps;
  hue?: NanoleafStateValueProps;
  sat?: NanoleafStateValueProps;
  ct?: NanoleafStateValueProps;
  colorMode?: string;
}
