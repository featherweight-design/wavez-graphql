import { Role } from '.prisma/client';
import { Field, InputType } from 'type-graphql';

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
  name?: string | null;

  @Field(() => RoleEnum, { nullable: true })
  role?: Role;
}

export { CreateUserInput, UpdateUserInput };
