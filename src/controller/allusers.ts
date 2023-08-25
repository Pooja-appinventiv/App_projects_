import { Express } from "express";
import { Request,Response } from "express";
import user1 from "../models/user";
import Redis from 'ioredis'

const RedisClient= new Redis({
    host:'127.0.0.1',
    port:6379
})

export const allusers=async(req:Request,res:Response)=>{
    const all =await user1.find();

    const keyName ='user';
    let responseArray:any='';
    const getChacheData = await RedisClient.get(keyName);

    if (getChacheData){
        responseArray =getChacheData;
        console.log('get cache')
    }else{
        responseArray = all
        console.log('set cache');
        RedisClient.set(keyName,JSON.stringify(all))

    }

    res.status(200).json(all)
}
