import datamapper from '../datamappers/profile.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import bcrypt from 'bcrypt';

const controller = {
  getProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const data = await datamapper.getProfile(userId);

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

    const profileUpdated = await datamapper.updateProfile(profileToUpdate, userId);
    res.json(profileUpdated);
  }),

  deleteProfile: asyncHandler(async (req, res) => {
    const userId = req.userId;
    await datamapper.deleteProfile(userId);
    res.status(204).json({ message: "Profile deleted" });
  }),
  renderAdminPage: async (req, res) => {
    try {
      const products = await datamapper.getAllProducts();
      res.render('products', { products });
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

};

export default controller;