import 'reflect-metadata';
import { PrismaClient } from '@prisma/client';
import { ApolloServer } from 'apollo-server';
import { buildSchemaSync } from 'type-graphql';

import { Context } from 'types';
import { DeviceResolver } from 'device';
import {
  NanoleafAuthTokenResolver,
  NanoleafEffectsResolver,
  NanoleafPanelResolver,
  NanoleafStateResolver,
} from 'nanoleaf';
import { UserResolver } from 'user';

const PORT = 4000;
const prisma = new PrismaClient();

const schema = buildSchemaSync({
  // emitSchemaFile: true,
  resolvers: [
    DeviceResolver,
    NanoleafAuthTokenResolver,
    NanoleafEffectsResolver,
    NanoleafPanelResolver,
    NanoleafStateResolver,
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

//! Old code to be referenced later

// const { ApolloServer, gql } = require('apollo-server');
// const find = require('local-devices');

// interface Device {
//   [key: string]: string;
//   ip: string;
//   name: string;
//   mac: string;
// }

// type DeviceProperty = 'ip' | 'name' | 'mac';

// type DevicesFilter<Type> = {
//   [Property in keyof Type]?: Type[Property];
// };

// const NANO_LEAF_MAC = '02:55:da';
// const LIFX_MAC = 'd0:73:d5';

// const findDeviceMatchByFilter = (device: Device, key: string, value: string) =>
//   device[key].toLocaleLowerCase().includes(value.toLocaleLowerCase());

// const getDevices = async (filter?: DevicesFilter<Device>) => {
//   const devices = await find();

//   if (filter) {
//     const filteredDevices = devices.filter((device: Device) => {
//       const match = Object.keys(filter).find((filterKey: string) =>
//         findDeviceMatchByFilter(device, filterKey, filter[filterKey]!)
//       );

//       console.log(match);
//       return match;
//     });

//     return filteredDevices;
//   }

//   return devices;
// };

// const getNanoLeafDevices = async () => {
//   const nanoLeafDevices = getDevices({ mac: NANO_LEAF_MAC });

//   return nanoLeafDevices;
// };

// const getLifxDevices = async () => {
//   const lifxDevices = getDevices({ mac: LIFX_MAC });

//   return lifxDevices;
// };

// const resolvers = {
//   Query: {
//     devices: () => getDevices(),
//     lifxDevices: () => getLifxDevices(),
//     nanoLeafDevices: () => getNanoLeafDevices(),
//   },
// };

// const typeDefs = gql`
//   type Device {
//     name: String
//     ip: String
//     mac: String
//   }

//   type Query {
//     devices: [Device]
//     lifxDevices: [Device]
//     nanoLeafDevices: [Device]
//   }
// `;

// const server = new ApolloServer({ typeDefs, resolvers });

// server.listen().then(({ url }: { url: string }) => {
//   console.log(`🚀 Server ready at ${url}`);
// });
