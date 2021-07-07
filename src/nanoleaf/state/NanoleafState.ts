import { ObjectType, Field } from "type-graphql";

import { NanoleafStateValueProps } from "types";

@ObjectType()
class NanoleafStateValue {
  @Field()
  value: string | boolean;

  @Field()
  min?: string;

  @Field()
  max?: string;
}

@ObjectType()
class NanoleafState {
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

export { NanoleafState, NanoleafStateValue };
