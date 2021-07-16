import { Field, InputType } from 'type-graphql';

@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;
}

export { CreateUserInput };
