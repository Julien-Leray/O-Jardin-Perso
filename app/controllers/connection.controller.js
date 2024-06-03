import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import datamapper from '../datamappers/connection.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';

const controller = {
  login: asyncHandler(async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    const user = await datamapper.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid data' });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid data' });
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user });
  }),

}

export default controller;