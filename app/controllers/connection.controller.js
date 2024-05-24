import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import datamapper from "../datamappers/connection.datamapper.js";

const controller = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json('Email and password are required');
      }
      const user = await datamapper.findByEmail(email);
      if (!user) {
        return res.status(401).json('Invalid data');
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json('Invalid data');
      }
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '2h' });

      res.json({ token, user });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

}

export default controller;