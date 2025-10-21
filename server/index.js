const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");

const authRoutes = require("./routes/Auth");

const app = express();
app.use(express.json());
const allowedOrigins = [
  "https://mzgn-htb.onrender.com",
  "https://mzgn-htb-client.onrender.com",

  "http://localhost:3000",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const cookieParser = require("cookie-parser");
app.use(cookieParser());

// חיבור למסד נתונים
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// שימוש בראוטים
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("API is running");
});
const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
  console.error("❌ SERVER ERROR:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
