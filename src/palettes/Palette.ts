import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class Palette {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  colors: string;
}

export default Palette;
