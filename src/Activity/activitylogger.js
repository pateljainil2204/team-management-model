import Activity from "../model/activitymodel.js";

const logactivity = async (userId, action, details = {}) => {
    try{
       await Activity.create({ user : userId, action, details })
    } catch ( error ) {
      console.error("Activity logging failed:", error.message)
    }
};

export default logactivity;