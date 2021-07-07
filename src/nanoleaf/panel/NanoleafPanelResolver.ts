import { Arg, Ctx, Query, Resolver } from "type-graphql";
import { Context } from "types";

import NanoleafPanel from "./NanoleafPanel";

@Resolver(NanoleafPanel)
class NanoleafPanelResolver {
  @Query(() => [NanoleafPanel])
  async getAllNanoleafPanels(
    @Ctx() { prisma }: Context
  ): Promise<NanoleafPanel[]> {
    const panels = await prisma.nanoleafProperties.findMany();

    return panels;
  }

  @Query(() => NanoleafPanel)
  async getNanoleafPanelById(
    @Arg("id") id: string,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafPanel | null> {
    const panel = await prisma.nanoleafProperties.findUnique({
      where: { id },
    });

    return panel;
  }
}

export default NanoleafPanelResolver;
