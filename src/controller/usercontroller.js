import User from "../model/usermodel.js";
import Task from "../model/taskmodel.js";
import Project from "../model/projectmodel.js";
import logactivity from "../Activity/activitylogger.js";

// Get all users with their tasks and projects (Admin only)
const getallusers = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }

    const users = await User.find();

    const usersWithDetails = await Promise.all(
      users.map(async (user) => {
        // Get tasks where user is creator or assigned
        const tasks = await Task.find({
          $or: [
            { createdBy: user._id },
            { assignedTo: user._id }
          ]
        }).populate("project", "name description members createdBy"); // include project info

        // Get projects where user is a member or creator
        const projects = await Project.find({
          $or: [
            { createdBy: user._id },
            { members: user._id }
          ]
        }).select("name description members createdBy"); // basic project info

        return {
          _id: user._id,
          username: user.username,
          email: user.email,
          tasks,
          projects
        };
      })
    );

    await logactivity(req.user.id, "Viewed All Users with Tasks and Projects");
    res.status(200).json(usersWithDetails);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { getallusers };