// Retrieve posts along with information about the users who created them and the total number of likes each post has.
import { Request,Response } from "express";
import user1 from "../../models/user";
import post from "../../models/post";
import { createClient } from "redis";
export const postinfo = async(req:Request,res:Response)=>{
    try {
    

       const ans= await post.aggregate([
            
        { $lookup: {
          from: 'user1',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user_info'
        },},
          ])

          res.json(ans)
       
      } catch (error) {
        console.error(error);
        // res.status(500).send('Internal server error');
      }
  
}
export default postinfo