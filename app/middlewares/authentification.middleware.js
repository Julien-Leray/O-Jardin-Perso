import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  try {
    const token = req.body.token;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default authMiddleware;
