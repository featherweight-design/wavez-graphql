import { Field, InputType } from "type-graphql";

@InputType()
class CreateNanoleafUserInput {
  @Field()
  userId: string;

  @Field()
  authToken: string;
}

export { CreateNanoleafUserInput };
