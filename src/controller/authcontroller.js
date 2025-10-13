import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";
import logactivity from "../Activity/activitylogger.js";

const saltRounds = 10;

// Register User
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Only allow role "Admin" if provided 
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role === "Admin" ? "Admin" : "Member",
    });

    await logactivity(user._id, "user registered"); // logger

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid username or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username or password" });

    const payload = { id: user._id, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" });

    await logactivity(user._id, "User Logged In");  //loggere

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export {login, register};