import express from "express";
import {getallusers, searchUser }  from "../controller/usercontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware(["Admin"]), getallusers);
router.get("/search", authentication,  roleMiddleware(["Admin"]),searchUser);

export default router;