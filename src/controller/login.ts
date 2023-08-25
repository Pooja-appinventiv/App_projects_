import Express from "express";
import { Request, Response } from "express";
import user1 from "../models/user";
import bcrypt from 'bcrypt';
// import { createToken } from "../middleware/gen_token";
import jwt from 'jsonwebtoken'
import sessionModel from '../models/session'
import { createClient } from 'redis';
const client = createClient();
client.on('error', err => console.log('Redis Client Error', err));
client.connect();

export const login_user = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const user = await user1.findOne({ username });
        // console.log(user)
        if (!user) {
            return res.status(404).json("user not found ")
        }
        const validPassword = await bcrypt.compare(password, user.password);
        // console.log(validPassword)
        if (!validPassword) {
            return res.status(401).json({ message: 'invalid' })
        }
        //session created in mongodb
        const session1 =sessionModel.insertMany({
            user_id:user._id,
            status:"Active",
            expire_at:"1000"
        })
        console.log(session1);
        await client.set('key',JSON.stringify(user));

        //token generation
        const token = jwt.sign({ email:user.email },'secret',{ expiresIn: "1h"});
        // res.send({ token: token })
        res.status(200).json({ message: 'Login successful' ,token});

    }
    catch (error) {
        res.status(500).json("user not found");
    }
}
