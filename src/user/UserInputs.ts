import { Role } from '.prisma/client';
import { Field, ID, InputType } from 'type-graphql';

import { RoleEnum } from 'types';

@InputType()
class CreateUserInput {
  @Field()
  accessKey: string;

  @Field()
  email: string;

  @Field()
  name: string;
}

@InputType()
class UpdateUserInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => RoleEnum, { nullable: true })
  role?: Role;
}

@InputType()
class UpdateUserAdminInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => RoleEnum, { nullable: true })
  role?: Role;

  @Field(() => Number, { nullable: true })
  invites?: number;
}

export { CreateUserInput, UpdateUserInput, UpdateUserAdminInput };
