import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
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
  // private _id: any;
}
export const user_schema = SchemaFactory.createForClass(user);
