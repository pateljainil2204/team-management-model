import express from "express";
import {
    createtask, 
    gettask, 
    updatetask, 
    deletetask
} from "../controller/taskcontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post("/", authentication, roleMiddleware(["Admin", "Member"]), createtask);
router.get("/", authentication, roleMiddleware(["Admin", "Member"]), gettask);
router.put("/:id", authentication, roleMiddleware(["Admin", "Member"]), updatetask);
router.delete("/:id", authentication, roleMiddleware(["Admin", "Member"]), deletetask);

export default router;