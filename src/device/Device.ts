import { Field, ID, ObjectType, registerEnumType } from 'type-graphql';

import { User } from 'user';
import { DeviceTypeEnum } from 'types';

registerEnumType(DeviceTypeEnum, {
  name: 'DeviceTypeEnum',
  description: "Device type as one of: 'NANOLEAF', 'LIFX', 'HUE'",
});
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

  @Field(() => DeviceTypeEnum)
  type: DeviceTypeEnum;

  @Field()
  user: User;

  @Field()
  userId: string;
}

export { Device, WifiDevice };
