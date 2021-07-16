import { Field, InputType } from 'type-graphql';

import { NanoleafStateValueProps } from 'types';

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
  on?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  brightness?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  hue?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  sat?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput, { nullable: true })
  ct?: NanoleafStateValueProps;

  @Field({ nullable: true })
  colorMode?: string;
}

export {
  AuthenticateNewUserInput,
  NanoleafStateInput,
  NanoleafStateValueInput,
};
