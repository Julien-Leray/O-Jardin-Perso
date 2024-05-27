import e from "express";
import datamapper from "../datamappers/admin.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import bcrypt from "bcrypt";

const controller = {
  getAllUsers: asyncHandler(async (req, res) => {
    const users = await datamapper.getAllUsers();
    if (!users) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.json(users);
  }),

  getOneUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await datamapper.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  }),

  createUser: asyncHandler(async (req, res) => {
    const newUser = req.body;
    console.log(newUser);

    if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
      return res.status(400).json({ message: 'Email, password, firstname and lastname are required' });
    }

    const doesUserExist = await datamapper.getUserByEmail(newUser.email);
    if (doesUserExist) {
      return res.status(400).json({ message: 'Email already used' });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;

    const user = await datamapper.createUser(newUser);
    res.status(201).json(user);
  }),

  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userToUpdate = req.body;

    if (!userToUpdate) {
      return res.status(400).json({ message: 'No data to update' });
    }

    if (userToUpdate.email) {
      const doesUserExist = await datamapper.getUserByEmail(userToUpdate.email);
      if (doesUserExist) {
        return res.status(400).json({ message: 'Email already used' });
      }
    }

    if (userToUpdate.password) {
      const hashedPassword = await bcrypt.hash(userToUpdate.password, 10);
      userToUpdate.password = hashedPassword;
    }

    const user = await datamapper.updateUser(id, userToUpdate);
    res.json(user);
  }),

  deleteUser: asyncHandler(async (req, res) => {
    const { id } = req.params;
    await datamapper.deleteUser(id);
    res.status(204).end();
  }),
};

export default controller;