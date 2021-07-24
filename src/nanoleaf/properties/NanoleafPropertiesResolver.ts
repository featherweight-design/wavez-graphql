import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'types';

import NanoleafProperties from './NanoleafProperties';

@Resolver(NanoleafProperties)
class NanoleafPropertiesResolver {
  @Query(() => [NanoleafProperties])
  async getAllNanoleafPropertiess(
    @Ctx() { prisma }: Context
  ): Promise<NanoleafProperties[]> {
    const panels = await prisma.nanoleafProperties.findMany();

    return panels;
  }

  @Query(() => NanoleafProperties, { nullable: true })
  async getNanoleafPropertiesById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafProperties | null> {
    const panel = await prisma.nanoleafProperties.findUnique({
      where: { id },
    });

    return panel;
  }
}

export default NanoleafPropertiesResolver;
