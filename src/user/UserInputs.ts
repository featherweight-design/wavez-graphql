import { Field, InputType } from "type-graphql";

@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  name?: string | null;
}

export { CreateUserInput };
