import asyncHandler from './asyncHandler.middleware.js';
import datamapper from '../datamappers/admin.datamapper.js';

const isAdmin = asyncHandler(async (req, res, next) => {
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized: User ID not provided" });
  }

  const user = await datamapper.getById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (user.is_admin = false) {
    return res.status(403).json({ message: "Forbidden: You do not have administrative privileges" });
  }

  next();
});

export default isAdmin;
