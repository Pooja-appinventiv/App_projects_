import {Document, Schema, model} from 'mongoose';
import mongoose from "mongoose";
interface action extends Document{
    user_id:mongoose.Schema.Types.ObjectId;
    post_id:mongoose.Schema.Types.ObjectId;
    // type_enum:String;
    // likes:Number;
    // comments:String;
    // comment_reply?:{
    //     reply_id:number,
    //     comment_id:string
    // }
  }
  
  const action_s = new Schema<action>({
   user_id:
         {type:mongoose.Schema.Types.ObjectId,required:true, ref: 'user1'},
   post_id:
        {type:mongoose.Schema.Types.ObjectId,required:true,ref:'post'},
//    type_enum:
//         {type:String,enum:['likes','comment']},
//    likes:{type:Number,ref: 'post'},
//    comments:{ required: true},
  });
  export default mongoose.model<action>('action',action_s);