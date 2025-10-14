import Task from "../model/taskmodel.js";
import User from "../model/usermodel.js";
import Project from "../model/projectmodel.js";
import logactivity from "../Activity/activitylogger.js";
import paginate from "../config/pagination.js";

// create task 
const createtask = async (req, res) => {
  try {
    const { title, description, status, project } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(400).json({ message: "Project not found" });

    const isMember = proj.members
      .filter(Boolean)
      .map(id => id.toString())
      .includes(req.user.id);

    if (req.user.role !== "Admin" && !isMember) {
      return res.status(400).json({ message: "Only Admin or Project Member can create tasks" });
    }

    const task = await Task.create({
      title,
      description,
      status: status || "To Do",
      project,
      createdBy: req.user.id,
    });
    // Log activity
    await logactivity(req.user.id, "Created Task", { taskId: task._id, projectId: project });

      const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    res.status(201).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get task 
const gettask = async (req, res) => {
  try {
    let filter = {};
    if (req.user.role === "Admin") {
      if (req.query.email) {
        const user = await User.findOne({ email: req.query.email });
        if (!user) return res.status(404).json({ message: "User not found" });
        filter = { $or: [{ createdBy: user._id }, { assignedTo: user._id }] };
      }
      else {
        filter = {};
      }
    } else {
      // Member can see tasks created by or assigned to them
      filter = { $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }] };
    }
    const paginatedTasks = await paginate(Task, req, filter);

    const tasks = await Task.find({ _id: { $in: paginatedTasks.data.map(t => t._id) } })
      .populate("project", "name description")
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// assign task
const assigntask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // checks user is already a project member
    const isMember = project.members
      .filter(Boolean)
      .map(id => id.toString())
      .includes(userId);

    if (!isMember) {
      return res.status(400).json({ message: "First assign this user to the project before assigning a task" });
    }

    task.assignedTo = task.assignedTo || [];

    if (task.assignedTo.map(id => id.toString()).includes(userId)) {
      return res.status(400).json({ message: "Member is already assigned to this task" });
    }

    task.assignedTo.push(userId);
    await task.save();
    await logactivity(req.user.id, "Assigned Task", { taskId: task._id, assignedUser: userId });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Remove Assigned User from Task (Admin only)
const removetaskassign = async (req, res) => {
  try {
    const taskId = req.params.id;
    const { userId } = req.body;

    if (!userId) return res.status(400).json({ message: "userId is required" });

    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // checks user is already a project member
    const isMember = project.members
      .filter(Boolean)
      .map(id => id.toString())
      .includes(userId);

    if (!isMember) {
      return res.status(400).json({ message: "Cannot remove. User is not a member of this project" });
    }

    task.assignedTo = task.assignedTo || [];
    task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);

    await task.save();
    await logactivity(req.user.id, "Removed Task Assignment", { taskId: task._id, removedUser: userId });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    res.status(200).json(populatedTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// update task 
const updatetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    const userId = req.user.id;

    // Admin can update everything
    if (req.user.role === "Admin" || task.createdBy.toString() === userId) {
      task.status = req.body.status || task.status;
    } 
    // Member can only update status if assigned
    else if (req.user.role === "Member") {
      if (!task.assignedTo || !task.assignedTo.includes(userId)) {
        return res.status(403).json({ message: "You are not assigned to this task" });
      }
      if (!req.body.status) {
        return res.status(400).json({ message: "Status is required to update" });
      }
      task.status = req.body.status;
    } 
    else {
      return res.status(403).json({ message: "Access denied" });
    }

    await task.save();
    //logger
    await logactivity(userId, "Updated Task", { taskId: task._id, projectId: task.project });

    const populatedTask = await Task.findById(task._id)
      .populate("project", "name description")
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    res.status(200).json(populatedTask);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete task 
const deletetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "task not found" });

    // only admin or creator can delete 
    if (req.user.role !== "Admin" && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();
    await logactivity(req.user.id, "Deleted Task", { taskId: task._id, projectId: task.project });

    res.status(200).json({ message: "task deleted successfully" });

  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export { createtask, gettask, updatetask, deletetask, assigntask, removetaskassign };