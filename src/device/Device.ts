import { DeviceType } from '@prisma/client';
import { Field, ID, ObjectType } from 'type-graphql';

@ObjectType()
class WifiDevice {
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
  userId: string;
}

export { Device, WifiDevice };
