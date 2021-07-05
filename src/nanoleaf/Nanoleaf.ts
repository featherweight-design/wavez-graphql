import { Field, ID, ObjectType } from "type-graphql";
import { User } from "user";

@ObjectType()
class NanoleafUser {
  @Field(() => ID)
  id: string;

  @Field(() => [NanoleafAuthToken])
  authTokens: NanoleafAuthToken[];

  @Field()
  userId: string;

  @Field(() => User)
  user: User;
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

  @Field(() => String, { nullable: true })
  panelId?: string;

  @Field(() => NanoleafPanel, { nullable: true })
  panel: NanoleafPanel | null;

  @Field(() => String, { nullable: true })
  nanoleafUserId?: string;

  @Field(() => NanoleafUser, { nullable: true })
  nanoleafUser: NanoleafUser;
}

export { NanoleafUser, NanoleafAuthToken, NanoleafPanel };
