import express from "express";
import user1 from './src/models/user';
import post from "./src/models/post";
import follower from "./src/models/follower";
import session from "./src/models/session";
import action from "./src/models/action";
import  router from "./src/routes/user_router";
const jwt = require('jsonwebtoken');
const swaggerJSDoc  = require('swagger-jsdoc')
const swaggerUi =require('swagger-ui-express')


//MOONGOSE CONNCETION
import {Document, Schema, Model} from 'mongoose';
import mongoose from "mongoose";
import like from "./src/models/like";
import RedisStore from "connect-redis";
const app = express();
app.use(express.json());
mongoose.connect('mongodb+srv://poojaa:123@cluster0.pf0tywt.mongodb.net/mydb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
} as any)
.then(() => {
  console.log("Connected to MongoDB");
  user1;
  post;
  follower;
  session;
  action;
  like;
})
.catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});
//END





const options={
  definition:{
    openapi :'3.0.0',
    info:{
      title: 'Node Js API Project for mongo',
      version:'1.0.0'
    },
    servers:[
      {
        url :' http://localhost:3000'
      }
    ]
  },
  apis:['./src/routes/user_router.ts']
}
const swaggerSpec= swaggerJSDoc(options)
app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerSpec))
// app.post('/signup',create_user);
// app.post('/login',login_user);/
// app.get('/allusers',allusers);

// app.get('/users',async(req:Request, res:Response)=>{
//     res.send("hi")
// })
app.use("/api",router)
// app.use("/api",router)
app.listen(3000,()=>{
    console.log("listening")
})








// import { Schema, Model } from 'mongoose';
// import {Document, Schema, Model} from 'mongoose';

// interface User extends Document{
//   username: string;
//   email: string;
//   password:string;
//   bio: string;
//   created_at:Date;
  
// }

// const userschema = new Schema<User>({
//   username: { type: String, required: true },
//   email: { type: String, required: true },
//   password:{ type:String,required:true},
//   bio:{type: String},
//   created_at:{type :Date,default:Date.now},


  
// });
// export default mongoose.model<User>('user1',userschema);
