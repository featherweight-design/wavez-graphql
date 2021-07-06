import { Field, InputType } from "type-graphql";

@InputType()
class AuthenticateNewUserInput {
  @Field()
  ip: string;

  @Field()
  name: string;

  @Field()
  mac: string;

  @Field()
  userId: string;
}

export { AuthenticateNewUserInput };
