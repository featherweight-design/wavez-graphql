import { Field, InputType } from "type-graphql";

import { NanoleafStateValueProps } from "types";

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

  @Field()
  min?: string;

  @Field()
  max?: string;
}

@InputType()
class NanoleafStateInput {
  @Field(() => NanoleafStateValueInput)
  on?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput)
  brightness?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput)
  hue?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput)
  sat?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValueInput)
  ct?: NanoleafStateValueProps;

  @Field()
  colorMode?: string;
}

export {
  AuthenticateNewUserInput,
  NanoleafStateInput,
  NanoleafStateValueInput,
};
