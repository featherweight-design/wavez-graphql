import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
class NanoleafPanel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  serialNo: string;

  @Field()
  firmwareVersion: string;

  @Field()
  model: string;
}

export default NanoleafPanel;
