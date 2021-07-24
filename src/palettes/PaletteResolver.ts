import { NanoleafProperties } from 'nanoleaf';
import { Ctx, FieldResolver, Resolver, Root } from 'type-graphql';
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
}

export default PaletteResolver;
