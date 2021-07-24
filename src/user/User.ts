import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;
}

export default User;
