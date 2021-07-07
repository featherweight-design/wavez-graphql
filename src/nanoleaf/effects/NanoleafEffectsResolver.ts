import fetch from "node-fetch";
import { UserInputError } from "apollo-server";
import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from "type-graphql";

import { Context } from "types";
import { constants } from "nanoleaf/definitions";
import NanoleafEffects from "./NanoleafEffects";
import { NanoleafPanel } from "nanoleaf/panel";
import { getAllPanelProperties } from "nanoleaf/utils";

@Resolver(NanoleafEffects)
class NanoleafEffectsResolver {
  @FieldResolver(() => NanoleafPanel)
  async properties(
    @Root() effects: NanoleafEffects,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafPanel | null> {
    const properties = await prisma.nanoleafEffects
      .findUnique({
        where: { propertiesId: effects.propertiesId },
      })
      .properties();

    return properties;
  }

  @Query(() => [String])
  async getPanelEffectsList(
    @Arg("deviceId") deviceId: string,
    @Ctx() { prisma }: Context
  ): Promise<string[]> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        authToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.authToken) {
      throw new UserInputError("Bad");
    }

    const { ip, authToken } = deviceProperties;

    const { effects } = await getAllPanelProperties(ip, authToken.authToken);

    return effects.effectsList;
  }

  @Mutation(() => Boolean)
  async updateCurrentEffectByDeviceId(
    @Arg("deviceId") deviceId: string,
    @Arg("effectName") effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Migrate to utility
    const deviceProperties = await prisma.device.findUnique({
      where: { id: deviceId },
      include: {
        authToken: true,
      },
    });

    if (!deviceProperties || !deviceProperties.authToken) {
      throw new UserInputError("Bad");
    }

    // TODO: Update schema to authToken.token
    const { ip, authToken } = deviceProperties;

    await fetch(constants.endpoints.update.effect(ip, authToken.authToken), {
      method: "PUT",
      body: JSON.stringify({ select: effectName }),
    });

    return true;
  }

  @Mutation(() => Boolean)
  async updateAllCurrentEffect(
    @Arg("userId") userId: string,
    @Arg("effectName") effectName: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Update to utility
    const devices = await prisma.device.findMany({
      where: { userId: userId, type: "NANOLEAF" },
      include: { authToken: true },
    });

    if (!devices.length) {
      throw new UserInputError("Bad");
    }

    devices.forEach(async ({ ip, authToken }) => {
      if (authToken) {
        await fetch(
          constants.endpoints.update.effect(ip, authToken.authToken),
          {
            method: "PUT",
            body: JSON.stringify({ select: effectName }),
          }
        );
      }
    });

    return true;
  }
}

export default NanoleafEffectsResolver;
