import { Field, InputType } from 'type-graphql';
@InputType()
class AuthenticateNewUserInput {
  @Field()
  ip: string;

  @Field()
  name: string;

  @Field()
  mac: string;
}

@InputType()
class NanoleafStateValueInput {
  @Field()
  value: string;

  @Field({ nullable: true })
  min?: string;

  @Field({ nullable: true })
  max?: string;
}

@InputType()
class NanoleafStateInput {
  @Field(() => NanoleafStateValueInput, { nullable: true })
  on?: NanoleafStateValueInput | null;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  brightness?: NanoleafStateValueInput | null;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  hue?: NanoleafStateValueInput | null;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  sat?: NanoleafStateValueInput | null;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  ct?: NanoleafStateValueInput | null;

  @Field({ nullable: true })
  colorMode?: string;
}

export {
  AuthenticateNewUserInput,
  NanoleafStateInput,
  NanoleafStateValueInput,
};
