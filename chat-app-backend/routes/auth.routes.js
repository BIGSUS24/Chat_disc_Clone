import express from "express";
import { signup } from "../controllers/auth.controller.js";
import { login } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { getMe } from "../controllers/auth.controller.js";
import { searchUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/getMe").get(verifyJWT,getMe);
router.route("/search").get(verifyJWT,searchUser);

export default router;