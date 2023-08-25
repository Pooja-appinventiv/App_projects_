import { Request,Response } from "express";
import user1 from "../../models/user";
import post from "../../models/post";
// Retrieve user sessions along with information about the user, including the login time for each session.
export const session_u=async(req:Request,res:Response)=>{
    try{
      const data= await user1.aggregate([
           
          { $lookup: {
            from: 'session',
            localField: '_id',
            foreignField: 'user_id',
            as: 'session_details'
          },},
          
             
          ])
  
            res.json(data)
    }catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }



}



