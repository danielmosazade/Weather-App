const jwt = require("jsonwebtoken");
exports.verifyToken = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).send("Access Denied");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).send("Invalid Token");
  }
};

// Optional: לבדוק אם המשתמש הוא admin
exports.verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).send("Access denied");
  next();
};