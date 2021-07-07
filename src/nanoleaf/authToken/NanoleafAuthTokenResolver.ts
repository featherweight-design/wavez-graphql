import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class NanoleafAuthToken {
  @Field(() => ID)
  id: string;

  @Field()
  authToken: string;
}

export default NanoleafAuthToken;
