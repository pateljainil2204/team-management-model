import Activity from "../model/activitymodel.js";

export const getAllactivity = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }
    const activities = await Activity.find()
      .populate("user", "username role")  //shows username and role 
      .sort({ createdAt: -1 });  // activity log newest to oldest

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default getAllactivity;