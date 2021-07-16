import { DeviceType } from '@prisma/client';
import { Field, ID, ObjectType } from 'type-graphql';

import { User } from 'user';

@ObjectType()
export class WifiDevice {
  @Field()
  ip: string;

  @Field()
  mac: string;

  @Field()
  name: string;
}

@ObjectType()
class Device extends WifiDevice {
  @Field(() => ID)
  id: string;

  @Field()
  type: DeviceType;

  @Field()
  user: User;

  @Field()
  userId: string;
}

export default Device;
