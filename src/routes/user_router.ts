import express from "express";
import { create_user } from "../controller/signup";
import { login_user } from "../controller/login";
import { allusers } from "../controller/allusers";
import  create_post  from "../controller/posts/post";
import { verifyToken } from "../middleware/verify_token";
import { count_post } from "../controller/posts/count_post";
import { count_likes } from "../controller/posts/count_likes";
import {postinfo} from "../controller/posts/post_info";
import { most_liked } from "../controller/posts/most_post_user";
import { count_com } from "../controller/posts/count_comment";
import { session_u } from "../controller/posts/session_detail";
const router = express.Router();



 
/**
 * @swagger
 * /api/signup:
 *   post:
 *     summary: Register user
 *     description: new user a user with their credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *             required:
 *               - username
 *               - email
 *               - password
 *               - bio
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               bio:
 *                 type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */


router.post("/signup",create_user);
/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Authenticate user
 *     description: Authenticate a user with their credentials.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */

router.post("/login",login_user);
router.get("/getall",allusers);
router.post("/post",verifyToken,create_post);
router.get("/count_post",count_post);
router.get("/count_likes",count_likes);
router.get("/post_info",postinfo);
router.get("/most_liked",most_liked);
router.get("/count_com",count_com);
router.get("/session_u",session_u)

export default router;