import { UserInputError } from "apollo-server-errors";
import { Arg, Ctx, Mutation, Resolver } from "type-graphql";

import { Context } from "types";
import { UpdateStateInput } from "nanoleaf/NanoleafInputs";
import { updateCurrentState } from 'nanoleaf/utils';
import { NanoleafState } from "./NanoleafState";

@Resolver(NanoleafState)
class NanoleafStateResolver {
  @Mutation(() => Boolean)
  async updateCurrentStateAll(
    @Arg("stateInput") stateInput: UpdateStateInput,
    @Arg("userId") userId: string,
    @Ctx() { prisma }: Context
  ): Promise<boolean> {
    // TODO: Update to utility
    const devices = await prisma.device.findMany({
      where: { userId: userId, type: "NANOLEAF" },
      include: { nanoleafAuthToken: true },
    });

    if (!devices.length) {
      throw new UserInputError("Bad");
    }

    devices.forEach(async ({ ip, nanoleafAuthToken }) => {
      if (nanoleafAuthToken) {
        await updateCurrentState(ip, nanoleafAuthToken.token, stateInput);
      }
    });

    return true;
  }
}

export default NanoleafStateResolver;
