import express from "express";
import { getMessages } from "../controllers/message.controller.js";
import { sendMessage } from "../controllers/message.controller.js";
import {verifyJWT} from "../middleware/auth.middleware.js";


const router = express.Router();

router.route("/:groupId").post(verifyJWT,sendMessage);
router.route("/:groupId").get(verifyJWT,getMessages);

export default router;