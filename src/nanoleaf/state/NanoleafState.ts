import { ObjectType, Field } from 'type-graphql';

import { NanoleafStateValueProps } from 'types';

@ObjectType()
class NanoleafStateValue {
  @Field()
  value: string;

  @Field()
  min?: string;

  @Field()
  max?: string;
}

@ObjectType()
class NanoleafState {
  @Field(() => NanoleafStateValue)
  on?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValue)
  brightness?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValue)
  hue?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValue)
  sat?: NanoleafStateValueProps;

  @Field(() => NanoleafStateValue)
  ct?: NanoleafStateValueProps;

  @Field()
  colorMode?: string;
}

export { NanoleafState, NanoleafStateValue };
