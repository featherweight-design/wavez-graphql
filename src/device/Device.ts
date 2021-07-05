import { Field, ID, ObjectType } from "type-graphql";

import { DeviceType } from "types";
import { User } from "user";

@ObjectType()
class Device {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  mac: string;

  @Field(() => DeviceType, { nullable: true })
  type?: DeviceType | null;

  @Field(() => User, { nullable: true })
  user?: User | null;

  @Field(() => String, { nullable: true })
  userId?: string | null;
}

export default Device;
