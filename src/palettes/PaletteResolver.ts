import { NanoleafProperties } from 'nanoleaf';
import { Arg, Ctx, FieldResolver, Query, Resolver, Root } from 'type-graphql';
import { Context } from 'types';
import Palette from './Palette';

@Resolver(Palette)
class PaletteResolver {
  @FieldResolver(() => [NanoleafProperties])
  async nanoleafProperties(
    @Root() palette: Palette,
    @Ctx() { prisma }: Context
  ): Promise<NanoleafProperties[]> {
    const nanoleafProperties = await prisma.palette
      .findUnique({
        where: { id: palette.id },
      })
      .nanoleafProperties();

    return nanoleafProperties;
  }

  @Query(() => Palette, { nullable: true })
  async getPaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette | null> {
    const palette = await prisma.palette.findUnique({
      where: {
        id,
      },
    });

    return palette;
  }
}

export default PaletteResolver;
