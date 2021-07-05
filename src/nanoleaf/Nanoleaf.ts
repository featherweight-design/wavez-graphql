import { Field, ID, ObjectType } from "type-graphql";
import { User } from "user";

@ObjectType()
export class NanoeafPanel {
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
export class NanoleafAuthToken {
  @Field(() => ID)
  id: string;

  @Field()
  authToken: string;

  @Field(() => String, { nullable: true })
  panelId?: string;

  @Field(() => NanoeafPanel, { nullable: true })
  panel: NanoeafPanel | null;

  @Field(() => String, { nullable: true })
  nanoleafUserId?: string;

  @Field(() => NanoleafUser, { nullable: true })
  nanoleafUser: NanoleafUser;
}

@ObjectType()
class NanoleafUser {
  @Field(() => ID)
  id: string;

  @Field(() => [NanoleafAuthToken])
  authtokens: NanoleafAuthToken[];

  @Field()
  userId: string;

  @Field(() => User)
  user: User;
}

export default NanoleafUser;
