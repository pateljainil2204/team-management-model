import Project from "../model/projectmodel.js";

// create project admin 
const createproject = async (req, res) => {
    try {
        const {name , description} = req.body;

        const project = await Project.create({
            name,
            description, 
            createdBy: req.user.id,
        });
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
      res.status(200).json({ message : "project deleted successfully" });
    } catch (error) {
        res.status(400).json({ message : error.message })
    }
};

// assign member 
const assignmember = async (req, res) => {
    try {
      const { userId } = req.body;
      const project = await Project.findById(req.params.id);
      if(!project) return res.status(404).json({ message : "project not found" });
      
      console.log("check >>", !project.members.map(id => id).includes(userId));
      
     if (!project.members.map(id => id).includes(userId)) {
      project.members.push(userId);
     }

    await project.save();

      res.status(200).json(project);
    } catch (error) {
      res.status(400).json({ message : error.message })
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
      
      res.status(200).json(project);
    } catch (error) {
       res.status(400).json({ message : error.message })
     }
   };

// get project 
const getproject = async (req, res) => {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (error) {
      res.status(400).json({ message : error.message})
    }
};

export {createproject, updateproject, deleteproject, assignmember, removemember, getproject};