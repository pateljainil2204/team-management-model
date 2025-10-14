import User from "../model/usermodel.js";
import Task from "../model/taskmodel.js";
import Project from "../model/projectmodel.js";
import logactivity from "../Activity/activitylogger.js";
import paginate from "../config/pagination.js";

// Get all users with their tasks and projects (Admin only)
const getallusers = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied. Admin only." });
    }
    const result = await paginate(User, req); //pagination

    const usersWithDetails = await Promise.all(
      result.data.map(async (user) => {
        const tasks = await Task.find({
          $or: [
            { createdBy: user._id },
            { assignedTo: user._id }
          ]
        }).populate("project", "name description members createdBy");
        const projects = await Project.find({
          $or: [
            { createdBy: user._id },
            { members: user._id }
          ]
        }).select("name description members createdBy");

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

//search user with username or email 
  const searchUser = async (req, res) => {
    try {
      if (req.user.role !== "Admin") {
        return res.status(403).json({ message: "Access denied. Admin only." });
      }

      if (!req.body.search) {
       return res.status(400).json({ message: "Search field is required" });
      }

      const filter = {
        $or: [
          { name: { $regex: req.body.search, $options: "i" } },
          { email: { $regex: req.body.search, $options: "i" } }
        ]
      };

      const result = await paginate(User, req, filter);

      const usersWithDetails = await Promise.all(
        result.data.map(async (user) => {
          const tasks = await Task.find({
            $or: [
              { createdBy: user._id },
              { assignedTo: user._id }
            ]
          }).populate("project", "name description members createdBy");

          const projects = await Project.find({
            $or: [
             { createdBy: user._id },
             { members: user._id }
            ]
          }).select("name description members createdBy");

          return {
            _id: user._id,
            name: user.name,
            email: user.email,
            tasks,
            projects
          };
        })
      );

    await logactivity(req.user.id, `Searched Users: ${req.body.search}`);
    res.status(200).json(usersWithDetails);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {getallusers, searchUser};