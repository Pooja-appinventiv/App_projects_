import { Request,Response } from "express";
// import post from "./post";
import post from "../../models/post";
import mongoose from "mongoose";
export const count_post=async(req:Request,res:Response)=>{
    try{
        const id=req.body;
        const mmatch = {
            $match: { user_id: new mongoose.Types.ObjectId(req.body.id) } 
          };
      
          const result = await post.aggregate([mmatch]);
          console.log("xyz",result)
        res.json(result) 
    }
    catch (err) {
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
