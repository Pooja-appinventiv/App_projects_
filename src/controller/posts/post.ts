import { Request,Response } from "express";
import user1 from "../../models/user";
// import post from "../../models/post";
import post from "../../models/post";
console.log("hii")
const create_post = async(req:Request,res:Response)=>{
    try{
        console.log("sdfmfdbfsm");
        const {user_id,caption,likes_count,comment_count}=req.body;
        const posts =new post({user_id,caption,likes_count,comment_count});
        await posts.save();
        res.status(201).json(posts);
    }
    catch(error)
    {
        res.status(500).json({error:"error occured"})
    }

}
export default create_post;