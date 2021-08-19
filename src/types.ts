import { PrismaClient } from '@prisma/client';
import { Context as ApolloContext } from 'apollo-server-core';
import { JwtPayload } from 'jsonwebtoken';
import { registerEnumType } from 'type-graphql';

import { User } from 'user';
import { createToken } from 'utils';

export interface Context extends ApolloContext {
  createToken: typeof createToken;
  prisma: PrismaClient;
  user: User | null;
}

export enum DeviceMacSubstringByType {
  NANOLEAF = '02:55:da',
  LIFX = 'd0:73:d5',
  HUE = 'ECB5',
}

export interface ErrorResponse {
  status: number;
  message: string;
  friendlyMessage: string;
}

//* Nanoleaf
export interface NanoleafAuthenticationResponse {
  auth_token: string;
}

export interface NanoleafPropertiesProps {
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

export interface NanoleafAllEffectsResponse {
  animations: NanoLeafAnimationResponse[];
}

export interface NanoLeafAnimationResponse {
  version: string;
  animName: string;
  animType: string;
  colorType: string;
  palette: NanoleafColorResponse[];
  pluginType: string;
  pluginUuid: string;
  pluginOptions?: NanoleafPluginOption[];
  hasOverlay: boolean;
}

export interface NanoleafPluginOption {
  name: string;
  value: number | string | boolean;
}

export interface NanoleafColorResponse {
  hue: number;
  saturation: number;
  brightness: number;
}

//* User
export enum RoleEnum {
  ADMIN = 'ADMIN',
  SUPPORTER = 'SUPPORTER',
  ALPHA = 'ALPHA',
  BETA = 'BETA',
  BASIC = 'BASIC',
}

registerEnumType(RoleEnum, {
  name: 'RoleEnum',
});

export interface UserJwtPayload extends JwtPayload {
  id: string;
  role: RoleEnum;
}
