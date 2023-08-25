import Express from "express";
import axios from 'axios';
import { Request,Response } from "express";
import user1 from "../models/user";
// import axios from '../middleware/axios';
// import { jwttoken } from "../middleware/gen_token";
export const create_user=async(req: Request,res:Response)=>{
    try{
    const {username,email,password,bio} =req.body;
    const user =new user1 ({username,email,password,bio})
    await user.save();
    // const apiResponse = await axios.post('https://3000/api/signup', {
    //   username,
    //   email,
    //   password,
    //   bio,
    // });
    // console.log("jwfgmf",apiResponse)

    // Assuming the external API responds with a success message
    // const successMessage: string = apiResponse.data.message;/////
    // console.log('Registration success:', successMessage);////
    // const apiResponse = await axios.post('https://example.com/api/signup', user);
    // res.json(apiResponse);
   
    // const token = jwttoken(user.id)
    res.status(201).json(user);
}
catch(error)
{
  console.log(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
}
