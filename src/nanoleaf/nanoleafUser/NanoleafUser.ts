import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class NanoleafUser {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;
}

export default NanoleafUser ;
