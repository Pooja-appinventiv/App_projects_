import {Document, Schema, model} from 'mongoose';
import mongoose from "mongoose";
interface follower extends Document{
    sender_id:mongoose.Schema.Types.ObjectId;
    receiver_id:mongoose.Schema.Types.ObjectId;
    status_enum:String;
    created_at_date:Date;
    updated_at_date:Date;
}
const follower_schema= new Schema<follower>({
    sender_id:
          {type: mongoose.Schema.Types.ObjectId, required: true,ref: 'user1'},
    receiver_id:
          {type: mongoose.Schema.Types.ObjectId, required: true,ref: 'user1'},
    status_enum:
          {type: String,required: true,enum:['pending','accepted']},
    created_at_date:
          {type:Date,default:Date.now},
    updated_at_date:
          {type:Date,default:Date.now},
})

export default mongoose.model<follower>('follower',follower_schema);