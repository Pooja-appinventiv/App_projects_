import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Role } from 'src/modules/event/decorator/role.enum';
export type UserDocument = user & Document;
@Schema()
export class user {
  @Prop()
  id: string;

  @Prop()
  email: string;

  @Prop({ required: true })
  username: string;

  // @Prop([String])
  // address:string[]
  @Prop({ required: true })
  password: string;
  @Prop([{ type: String }])
  roles: Role[];
  @Prop({ type: [String] }) // Array of strings representing liked event topics
  interest: string[];
  @Prop({ default: false }) // Default value is false, indicating two-factor auth is not enabled
  hasTwoFactorAuth: boolean;
  @Prop()
  secretKey: string;
}
export const user_schema = SchemaFactory.createForClass(user);
