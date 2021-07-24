import { Device } from 'device';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Context } from 'types';

import NanoleafProperties from './NanoleafProperties';

@Resolver(NanoleafProperties)
class NanoleafPropertiesResolver {
  @FieldResolver(() => Device)
  async device(
    @Root() nanoleafProperties: NanoleafProperties,
    @Ctx() { prisma }: Context
  ): Promise<Device | null> {
    const device = await prisma.nanoleafProperties
      .findUnique({
        where: {
          id: nanoleafProperties.id,
        },
      })
      .device();

    return device;
  }

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
