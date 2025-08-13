const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).send("No token provided");

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).send("No token provided");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).send("Invalid token");
    req.user = decoded; // שומר את מידע הפענוח ב-request
    next();
  });
};
