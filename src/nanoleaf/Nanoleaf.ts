import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class NanoleafUser {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;
}

@ObjectType()
class NanoleafPanel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  serialNo: string;

  @Field()
  firmwareVersion: string;

  @Field()
  model: string;
}

@ObjectType()
class NanoleafAuthToken {
  @Field(() => ID)
  id: string;

  @Field()
  authToken: string;
}

@ObjectType()
class NanoleafEffects {
  @Field()
  select: string;

  @Field(() => [String])
  effectsList: string[]

  @Field()
  propertiesId: string;
}

export { NanoleafUser, NanoleafAuthToken, NanoleafPanel, NanoleafEffects };
