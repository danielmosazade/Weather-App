const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
require("dotenv").config();

exports.register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password)
      return res.status(400).send("All fields are required");

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send("Email already exists");

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed, role });
    await user.save();

    res.status(201).send("User registered");
  } catch (err) {
    console.error(err);
    res.status(500).send("Registration error");
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,      
    sameSite: "none",  
  }).send("Logged out");
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).send("Invalid password");

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Render חייב https
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 3600000 // 1 שעה
    }).json({ username: user.username, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
};
exports.deleteUser = async (req, res) => {
  try {
    const { username } = req.params;
    const deleted = await User.findOneAndDelete({ username });
    if (!deleted) return res.status(404).send("User not found");
    res.send(`User '${username}' deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete error");
  }
};
exports.updateUsername = async (req, res) => {
  try {
    const { oldUsername, newUsername } = req.body;

    if (!oldUsername || !newUsername)
      return res.status(400).send("Both old and new usernames are required");

    const updatedUser = await User.findOneAndUpdate(
      { username: oldUsername },
      { username: newUsername },
      { new: true } // מחזיר את המשתמש לאחר העדכון
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.send(`Username updated to '${updatedUser.username}'`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating username");
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).send("User not found");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error getting user data");
  }
};
// מביא את כל המשתמשים (רק אדמין)
exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "admin") return res.status(403).send("Access denied");

    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
};

// מחיקת משתמש לפי ID
exports.deleteUserById = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).send("Access denied");

    const { id } = req.params;
    const deleted = await User.findByIdAndDelete(id);
    if (!deleted) return res.status(404).send("User not found");

    res.send(`User '${deleted.username}' deleted`);
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete error");
  }
};

// עדכון שם משתמש לפי ID
exports.updateUsernameById = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).send("Access denied");

    const { id } = req.params;
    const { newUsername } = req.body;

    if (!newUsername) return res.status(400).send("New username is required");

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username: newUsername },
      { new: true }
    );

    if (!updatedUser) return res.status(404).send("User not found");

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(500).send("Update error");
  }
};
exports.getEmailByUsername = async (req, res) => {
  console.log(req);
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }, { email: 1, _id: 0 }).lean();
    if (!user) {
      return res.status(404).json({ message: "משתמש לא נמצא" });
    }
    res.json({ email: user.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};
exports.getUserNameByEmail = async (req, res) => {
  console.log(req);
  const { email } = req.params;
  try {
    const user = await User.findOne({ email }, { username: 1, _id: 0 }).lean();
    if (!user) {
      return res.status(404).json({ message: "איימיל לא נמצא" });
    }
    res.json({ username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "שגיאה בשרת" });
  }
};

// עדכון תפקיד משתמש לפי ID
exports.updateUserRole = async (req, res) => {
  console.log("=== UPDATE USER ROLE ===");
  console.log("Params:", req.params);
  console.log("Body:", req.body);
  console.log("User from token:", req.user);

  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['user', 'admin'].includes(role)) {
      console.log("❌ Invalid role received:", role);
      return res.status(400).send("Invalid role");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { role }, { new: true });

    if (!updatedUser) {
      console.log("⚠️ User not found:", id);
      return res.status(404).send("User not found");
    }

    console.log("✅ Updated user successfully:", updatedUser.email, "→", updatedUser.role);
    res.json(updatedUser);
  } catch (err) {
    console.error("🔥 Error updating user role:", err);
    res.status(500).send("Server error");
  }
};
