import express from "express";
import authRoute from "./authroute.js";
import userRoute from "./userroute.js";
import projectRoute from "./projectroute.js";
import taskRoute from "./taskroute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/projects", projectRoute);
router.use("/tasks", taskRoute);

export default router;