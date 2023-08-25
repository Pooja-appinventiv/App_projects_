import {Document, Schema, model} from 'mongoose';
import mongoose from "mongoose";
import bcrypt from 'bcrypt';
interface User extends Document{
    username: string;
    email: string;
    password:string;
    bio: string;
    // created_at:Date; 
  }
  const userschema = new Schema<User>({
    username: 
    { type: String, required: true },
    email: 
    { type: String, required: true },
    password:
    { type:String,required:true},
    bio:
    {type: String},
    // created_at:{type :Date,default:Date.now},
    
  });
  userschema.pre<User>('save', async function (next) {
    try {
      if (!this.isModified('password')) {
        return next();
      }
  
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next();
    }
    
  });

//   const validatePassword(password: string) =>{
//     return bcrypt.compare(password, );
//   }





  export default mongoose.model<User>('user1',userschema);