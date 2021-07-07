import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class NanoleafEffects {
  @Field(() => ID)
  id: string;

  @Field()
  select: string;

  @Field(() => [String])
  effectsList: string[]

  @Field()
  propertiesId: string;
}

export default NanoleafEffects;
