import { Field, InputType } from "type-graphql";

@InputType()
class AuthenticateNewUserInput {
  @Field()
  ip: string;

  @Field()
  name: string;

  @Field()
  mac: string;
}

export { AuthenticateNewUserInput };
