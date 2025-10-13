import Task from "../model/taskmodel.js";
import Project from "../model/projectmodel.js";
import logactivity from "../Activity/activitylogger.js";

// create task for member 
const createtask = async (req, res) => {
  try {
    const { title, description, status, project } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(400).json({ message: "Project not found" });

   if (
  req.user.role === "Member" &&
  !proj.members.filter(Boolean).map(id => id.toString()).includes(req.user.id)
) {
  return res.status(403).json({ message: "Not a member of this project" });
}

    const task = await Task.create({
      title,
      description,
      status: status || "To Do",
      project,
      createdBy: req.user.id,
    });
    // logger
    await logactivity(req.user.id, "Created Task", 
      { taskId: task._id, projectId: project });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get task 
const gettask = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all tasks where user is creator or assigned
   const tasks = await Task.find({
    $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }]
   }).populate("project", "name description");

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

    task.assignedTo = task.assignedTo || [];

    if (task.assignedTo.map(id => id.toString()).includes(userId)) {
      return res.status(400).json({ message: "Member is already assigned to this task" });
    }

    task.assignedTo.push(userId);
    await task.save();
    await logactivity(req.user.id, "Assigned Task", { taskId: task._id, assignedUser: userId });

    res.status(200).json(task);
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

    task.assignedTo = task.assignedTo || [];
    task.assignedTo = task.assignedTo.filter(id => id.toString() !== userId);

    await task.save();
    await logactivity(req.user.id, "Removed Task Assignment", { taskId: task._id, removedUser: userId });

    res.status(200).json(task);
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
    if (req.user.role === "Admin" || task.createdBy === userId) {
      task.title = req.body.title || task.title;
      task.description = req.body.description || task.description;
      task.status = req.body.status || task.status;
    } 
    // Member can only update status if assigned
    else if (req.user.role === "Member") {
      if (!task.assignedTo || !task.assignedTo.includes(userId)) {
        return res.status(403).json({ message: "You are not assigned to this task" });
      }

      // Only status can be updated by assigned member
      if (!req.body.status) {
        return res.status(400).json({ message: "Status is required to update" });
      }
      task.status = req.body.status;
    } 
    else {
      return res.status(403).json({ message: "Access denied" });
    }
    await task.save();

    // logger
    await logactivity(userId, "Updated Task", { taskId: task._id, projectId: task.project });
    res.status(200).json(task);

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// delete task 
const deletetask = async (req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: "task not found" });

    // only admin or creator can delete 
         if (req.user.role !== "Admin" && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
     await task.deleteOne();
     // logger
     await logactivity(req.user.id, "Deleted Task", 
       { taskId: task._id, projectId: task.project });
     res.status(200).json({ message: "task deleted successfully" });

    } catch (error) {
      res.status(404).json({ message: error.message });
     }
   };

export {createtask, gettask, updatetask, deletetask, assigntask, removetaskassign}; 