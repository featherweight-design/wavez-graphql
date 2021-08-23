import { Role } from '@prisma/client';
import { ObjectType, Field, ID } from 'type-graphql';

import { RoleEnum } from 'types';

@ObjectType()
class User {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => RoleEnum)
  role: Role;

  @Field()
  invites: number;
}

@ObjectType()
class SignInResponse {
  @Field(() => User)
  user: User;

  @Field()
  token: string;
}

export { SignInResponse, User };
