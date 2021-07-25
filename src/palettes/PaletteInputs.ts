import { Field, InputType } from 'type-graphql';

@InputType()
class CreatePaletteInput {
  @Field()
  name: string;

  @Field()
  colors: string;

  @Field()
  userId: string;
}

export { CreatePaletteInput };
