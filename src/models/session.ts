import { boolean } from 'joi';
import {Document, Schema, model} from 'mongoose';
import mongoose from "mongoose";
interface session extends Document{
    user_id:mongoose.Schema.Types.ObjectId;
    status?: String;
    expire_at:Number;
    // device_type:String;
    // created_at:Date;
    // updated_at:Date;
    // issessionActive: Boolean
  }
  
  const session_s = new Schema<session>({
    
    user_id:
        {type:mongoose.Schema.Types.ObjectId,required:true,ref : 'user1'},
    status:
        {type: String},
    expire_at:
    {
      type:Number
    }
    // device_type:
    //      { type:String},
    // created_at:
    //      {type:Date,default:Date.now},
    // updated_at:
    //      {type:Date,default:Date.now}  
    
  });
  export default mongoose.model<session>('session',session_s);