import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class NanoleafState {
  @Field(() => ID)
  id: string;

  @Field()
  value: string | boolean;

  @Field()
  min?: string;

  @Field()
  max?: string;
}

export default NanoleafState;
