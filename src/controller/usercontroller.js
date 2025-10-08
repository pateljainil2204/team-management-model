import User from "../model/usermodel.js";

//get all users admin only
const getallusers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(401).json({error : error.message });
    }
  };

export default getallusers;