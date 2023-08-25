// Find the top users who have created the most posts in descending order.
import { Request,Response } from "express";
import user1 from "../../models/user";
import post from "../../models/post";
import { createClient } from "redis";
export const most_liked=async(req:Request,res:Response)=>{
      try{
        const data= await post.aggregate([
             
            { $lookup: {
              from: 'user1',
              localField: 'user_id',
              foreignField: '_id',
              as: 'usersDetails'
            },},
            
               
            ]).sort({"user_id":-1});
    
              res.json(data)
      }catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
      }
  


}