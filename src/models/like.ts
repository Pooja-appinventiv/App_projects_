import { Schema, model, Document, Types } from 'mongoose';
import mongoose from "mongoose";
// import post from './post';
interface like extends Document {
  post_id:mongoose.Schema.Types.ObjectId;
}

const likeschema = new Schema<like>({
  post_id: {
    type:mongoose.Schema.Types.ObjectId,
    ref: 'post',
    required: true,
  }
});

export default mongoose.model<like>('like', likeschema);