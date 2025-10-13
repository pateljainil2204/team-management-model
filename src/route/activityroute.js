import express, { Router } from "express";
import getAllactivity from "../controller/activitycontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.get("/", authentication, roleMiddleware([ "Admin" ]),getAllactivity);

export default router;