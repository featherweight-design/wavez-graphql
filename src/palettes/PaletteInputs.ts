import { DeviceType } from '@prisma/client';
import { Field, InputType } from 'type-graphql';

@InputType()
class CreatePaletteInput {
  @Field()
  name: string;

  @Field()
  colors: string;
}

@InputType()
class SetPaletteByDeviceIdInput {
  @Field()
  id: string;

  @Field()
  deviceId: string;
}

@InputType()
class SetPaletteByDeviceType {
  @Field()
  id: string;

  @Field()
  type: DeviceType;
}

@InputType()
class UpdatePaletteColorsInput {
  @Field()
  id: string;

  @Field()
  newColors: string;

  @Field()
  shouldUpdateDevices?: boolean;
}

@InputType()
class UpdatePaletteNameInput {
  @Field()
  id: string;

  @Field()
  newName: string;

  @Field()
  shouldUpdateDevices?: boolean;
}

export {
  CreatePaletteInput,
  SetPaletteByDeviceIdInput,
  SetPaletteByDeviceType,
  UpdatePaletteColorsInput,
  UpdatePaletteNameInput,
};
