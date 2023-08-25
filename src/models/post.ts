import {Document, Schema, model} from 'mongoose';
import mongoose from "mongoose";
// const Schema =mongoose
interface post extends Document{
    user_id:mongoose.Schema.Types.ObjectId;
    // _id:Number;
    caption:String;
    // created_at_date:Date;
    likes_count:Number
    comment_count:Number
    // hashtages:object;
    // tags:object;

}
const postschema= new Schema<post>({
    // _id:
    //     {type:Number,required:true},
    user_id:
        {type: mongoose.Schema.Types.ObjectId,ref: 'user1',required: true},
    caption:
       {type: String},
    // created_at_date:
    //    {type:Date,default:Date.now},
    likes_count:
        {type:Number},
    comment_count:
       {type:Number},
    // hashtages:
    //     {type:Object},
    //  tags:
    //     {type: Object}
})

export default mongoose.model<post>('post',postschema);
