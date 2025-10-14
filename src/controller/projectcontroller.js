import Project from "../model/projectmodel.js";
import Task from "../model/taskmodel.js";
import paginate from "../config/pagination.js";
import logactivity from "../Activity/activitylogger.js";

// create project admin 
const createproject = async (req, res) => {
    try {
        const {name , description} = req.body;

        const project = await Project.create({
            name,
            description, 
            createdBy: req.user.id,
        });

       // logger
        await logactivity(req.user.id, "Created Project", { projectId: project._id });

        res.status(201).json(project);
    } catch (error) {
      res.status(401).json({ message : error.message });
    }
};

// update project adminn 
const updateproject = async (req, res) => {
    try {
       const project = await Project.findById(req.params.id);
       if(!project) return res.status(404).json({ message: "project not found" });

       project.name = req.body.name || project.name;
       project.description =  req.body.description || project.description;

       await project.save();
      // logger
       await logactivity(req.user.id, "Updated Project", { projectId: project._id });

       res.status(200).json({ message : "updated project",project});
    } catch (error) {
       res.status(401).json({ message : error.message });
    }
};

// delete project admin
const deleteproject = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if(!project) return res.status(404).json({ message : "project not found" });

      await project.deleteOne();
      // logger
      await logactivity(req.user.id, "Deleted Project", { projectId: project._id });

      res.status(200).json({ message : "project deleted successfully" });
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
};

// assign member 
const assignmember = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ message: "userId is required" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "project not found" });

    project.members = project.members || [];

    if (project.members.map(id => id.toString()).includes(userId)) {
      return res.status(400).json({ message: "Member is already assigned to this project" });
    }

    project.members.push(userId);
    await project.save();
    await logactivity(req.user.id, "Assigned Member", { projectId: project._id, assignedUser: userId });
    res.status(200).json(project);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// remove member 
const removemember = async (req, res) => {
    try {
      const { userId } = req.body;
      const project = await Project.findById(req.params.id);
      if(!project) return res.status(404).json({ message : "project not found" });

      project.members = project.members.filter((id) =>  id !== userId);
      await project.save();
     // logger 
      await logactivity(req.user.id, "Removed Member", 
          { projectId: project._id, removedUser: userId });

      res.status(200).json(project);
    } catch (error) {
       res.status(400).json({ message : error.message })
     }
   };

// get project 
const getproject = async (req, res) => {
  try {
    const paginatedProjects = await paginate(Project, req);
    const projects = await Project.find({ _id: { $in: paginatedProjects.data.map(p => p._id) } });
    res.status(200).json(projects);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getProjectWithMembers = async (req, res) => {
  try {
    const projectId = req.params.id;
    const project = await Project.findById(projectId)
      .populate("members", "username email role")
      .populate("createdBy", "username email role");

    if (!project) return res.status(404).json({ message: "Project not found" });

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    res.status(200).json({
      project,
      tasks,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


const gettasksbyprojectId = async (req, res) => {
  try {
    const projectId = req.params.id;

    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "username email role")
      .populate("createdBy", "username email role");

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this project" });
    }

    res.status(200).json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export {createproject, updateproject, deleteproject, assignmember, removemember, getproject, 
        getProjectWithMembers, gettasksbyprojectId };