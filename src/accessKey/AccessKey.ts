import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class AccessKey {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field()
  email: string;

  @Field()
  userId: string;
}

export default AccessKey;
