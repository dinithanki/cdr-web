import jwt from "jsonwebtoken";

// Protect routes middleware
export const protect = (req, res, next) => {
  const tokenString = req.headers.authorization;

  if (!tokenString) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  const token = tokenString.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.user = decoded; // now req.user has user info
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
};
