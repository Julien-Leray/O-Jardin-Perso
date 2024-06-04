import datamapper from '../datamappers/profile.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import bcrypt from 'bcrypt';

const controller = {
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const data = await datamapper.getById(userId);

    if (!data) {
      return res.status(400).json({ message: 'No profile found.' });
    }
    const dataWithoutPassword = { ...data };
    delete dataWithoutPassword.password;

    res.status(200).json(dataWithoutPassword);
  }),

  updateProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const profileToUpdate = req.body;

    if (!profileToUpdate) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    if (profileToUpdate.password) {
      const hashedPassword = await bcrypt.hash(profileToUpdate.password, 10);
      profileToUpdate.password = hashedPassword;
    }

    const profileUpdated = await datamapper.update(userId, profileToUpdate);
    res.status(200).json(profileUpdated);
  }),

  deleteProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    await datamapper.delete(userId);
    res.status(204).json({ message: "Profile deleted" });
  }),

};

export default controller;