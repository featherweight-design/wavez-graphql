import { ObjectType, Field, ID } from "type-graphql";

@ObjectType()
class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name: string;

  // @Field(() => NanoleafUser, { nullable: true })
  // nanoleafUser?: NanoleafUser;

  // @Field(() => [Device], { nullable: true })
  // devices: Device[]
}

export default User;
