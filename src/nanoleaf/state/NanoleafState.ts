import { ObjectType, Field } from 'type-graphql';

// import { NanoleafStateValueProps } from 'types';

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
  @Field(() => NanoleafStateValue, { nullable: true })
  on: NanoleafStateValue | null;

  @Field(() => NanoleafStateValue, { nullable: true })
  brightness: NanoleafStateValue | null;

  @Field(() => NanoleafStateValue, { nullable: true })
  hue: NanoleafStateValue | null;

  @Field(() => NanoleafStateValue, { nullable: true })
  sat: NanoleafStateValue | null;

  @Field(() => NanoleafStateValue, { nullable: true })
  ct: NanoleafStateValue | null;

  @Field({ nullable: true })
  colorMode?: string;
}

export { NanoleafState, NanoleafStateValue };
