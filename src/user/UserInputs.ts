import { Role } from '.prisma/client';
import { Field, InputType } from 'type-graphql';

import { RoleEnum } from 'types';

@InputType()
class CreateUserInput {
  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;
}

@InputType()
class UpdateUserInput {
  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => RoleEnum, { nullable: true })
  role?: Role;
}

export { CreateUserInput, UpdateUserInput };
