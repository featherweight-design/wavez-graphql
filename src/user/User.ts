import { Role } from '@prisma/client';
import { ObjectType, Field, ID } from 'type-graphql';

import { RoleEnum } from 'types';

@ObjectType()
class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => RoleEnum)
  role: Role;
}

export default User;
