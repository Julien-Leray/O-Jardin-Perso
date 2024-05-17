import bcrypt from "bcrypt";

import registrationDatamapper from "../datamappers/registration.datamapper.js";
import connectionDatamapper from "../datamappers/connection.datamapper.js";

const controller = {
  registration: async (req, res) => {
    try {
      let newUser = req.body;
      if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
        return res.status(400).json('Email, password, firstname and lastname are required');
      }
      const doesUserExist = await connectionDatamapper.findByEmail(newUser.email);
      if (doesUserExist) {
        return res.status(400).json('Email already used');
      }
      const hashedPassword = await bcrypt.hash(newUser.password, 10);
      newUser.password = hashedPassword;
      const userCreated = await registrationDatamapper.createUser(newUser);

      res.status(201).json(userCreated);

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default controller;