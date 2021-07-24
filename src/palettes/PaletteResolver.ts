import {
  Arg,
  Ctx,
  FieldResolver,
  Mutation,
  Query,
  Resolver,
  Root,
} from 'type-graphql';

import { Device } from 'device';
import { Context } from 'types';
import { User } from 'user';
import Palette from './Palette';

@Resolver(Palette)
class PaletteResolver {
  @FieldResolver(() => [Device])
  async devices(
    @Root() palette: Palette,
    @Ctx() { prisma }: Context
  ): Promise<Device[]> {
    const devices = await prisma.palette
      .findUnique({
        where: { id: palette.id },
      })
      .devices();

    return devices;
  }

  @FieldResolver(() => User)
  async user(
    @Root() palette: Palette,
    @Ctx() { prisma }: Context
  ): Promise<User | null> {
    const user = await prisma.palette
      .findUnique({
        where: {
          id: palette.id,
        },
      })
      .user();

    return user;
  }

  @Query(() => [Palette])
  async getAllPalettesByUserId(
    @Arg('userId') userId: string,
    @Ctx() { prisma }: Context
  ): Promise<Palette[]> {
    const palettes = await prisma.palette.findMany({
      where: {
        userId,
      },
    });

    return palettes;
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

  @Mutation(() => String)
  async deletePaletteById(
    @Arg('id') id: string,
    @Ctx() { prisma }: Context
  ): Promise<string> {
    await prisma.palette.delete({
      where: { id },
    });

    return id;
  }
}

export default PaletteResolver;
