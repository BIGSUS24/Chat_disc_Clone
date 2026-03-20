import express from "express";
import { getMessages } from "../controllers/message.controller.js";
import { sendMessage } from "../controllers/message.controller.js";
import {verifyJwT} from "../middlewares/auth.middleware.js"


const router = express.Router();

router.route("/:groupId").post(verifyJwT,sendMessage);
router.route("/;groupId").get(verifyJwT,getMessages)

export default router;