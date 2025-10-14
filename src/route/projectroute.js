import express from "express";
import {
  createproject, 
  updateproject, 
  deleteproject, 
  assignmember, 
  removemember, 
  getProjectWithMembers,
  getproject,
  gettasksbyprojectId
} from "../controller/projectcontroller.js";
import authentication from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router = express.Router();

router.post("/", authentication, roleMiddleware("Admin"), createproject);
router.put("/:id",authentication, roleMiddleware(["Admin", "Member"]),updateproject);
router.delete("/:id",authentication, roleMiddleware("Admin"), deleteproject);
router.post("/:id/assign", authentication, roleMiddleware("Admin"), assignmember);
router.post("/:id/remove",authentication, roleMiddleware("Admin"), removemember);
router.get("/my",authentication, roleMiddleware("Admin"), getproject);
router.get("/:id/member", authentication, roleMiddleware(["Admin"]), getProjectWithMembers);
router.get("/:id/tasks", authentication, roleMiddleware(["Admin"]), gettasksbyprojectId);

export default router;