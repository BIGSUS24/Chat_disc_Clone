import { verifyJWT } from "../middleware/auth.middleware.js";
import express from "express";
import { createGroup,getUserGroup } from "../controllers/group.controller.js";

const router = express.Router();

router.route("/").post(verifyJWT,createGroup);
router.route("/").get(verifyJWT,getUserGroup);

export default router;