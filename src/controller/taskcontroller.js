import Task from "../model/taskmodel.js";
import Project from "../model/projectmodel.js";

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

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// get task 
const gettask = async (req, res) => {
  try {
    const { projectid } = req.body; 
    if (!projectid) return res.status(400).json({ message: "Project ID required" });

    const tasks = await Task.find({ project: projectid, createdBy: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

// update task 
const updatetask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    const project = await Project.findById(task.project);
    if (!project) return res.status(404).json({ message: "Project not found" });

    // allow update if Admin, creator
    if (
      req.user.role === "Member" &&
      task.createdBy !== req.user.id &&
      !(task.assignedTo && task.assignedTo.includes(req.user.id)) &&
      !isMember
    ) {
      return res.status(403).json({ message: "Access denied" });
    }
   // only Admin or creator can mark as Done
    if (
      req.body.status === "Done" &&
      req.user.role !== "Admin" &&
      task.createdBy !== req.user.id
    ) {
      return res.status(403).json({ message: "Only Admin or creator can mark as Done" });
    }
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.status = req.body.status || task.status;

    await task.save();
    res.status(200).json(task);

  } catch (error) {
    res.status(404).json({ message: error.message });
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
     res.status(200).json({ message: "task deleted successfully" });

    } catch (error) {
      res.status(404).json({ message: error.message });
     }
   };

export {createtask, gettask, updatetask, deletetask}; 