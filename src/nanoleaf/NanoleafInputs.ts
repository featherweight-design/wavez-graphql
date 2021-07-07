import { Field, InputType } from "type-graphql";

import { NanoleafStateValueProps } from "types";
import { NanoleafStateResolver, NanoleafStateValue } from "nanoleaf/state";

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
class UpdateStateInput {
  @Field()
  on?: NanoleafStateValueProps;

  @Field()
  brightness?: NanoleafStateValueProps;

  @Field()
  hue?: NanoleafStateValueProps;

  @Field()
  sat?: NanoleafStateValueProps;

  @Field()
  ct?: NanoleafStateValueProps;

  @Field()
  colorMode?: string;
}

export { AuthenticateNewUserInput, UpdateStateInput };
