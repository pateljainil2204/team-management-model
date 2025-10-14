import Activity from "../model/activitymodel.js";
import paginate from "../config/pagination.js";

const getAllactivity = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ message: "Access denied — Admins only" });
    }

    const result = await paginate(Activity, req);//pagination 
    const activities = await Activity.find()
      .populate("user", "username role")  //shows username and role 
      .sort({ createdAt: -1 })  // activity log newest to oldest
      .skip((result.currentPage - 1) * result.perPage)
      .limit(result.perPage);

    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default getAllactivity;