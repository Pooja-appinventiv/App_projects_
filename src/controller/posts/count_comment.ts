import { Request,Response } from "express";
import user1 from "../../models/user";
import post from "../../models/post";
import { createClient } from "redis";
export const count_com=async(req:Request,res:Response)=>{
    try{
      const data= await post.aggregate([
           
          { $lookup: {
            from: 'user1',
            localField: 'user_id',
            foreignField: '_id',
            as: 'usersDetails'
          },},
          
             
          ]).sort({"_id":-1});
  
            res.json(data)
    }catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }



}
