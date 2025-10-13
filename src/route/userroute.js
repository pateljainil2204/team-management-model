import express from "express";
import {getallusers }  from "../controller/usercontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware(["Admin"]), getallusers);

export default router;