import bcrypt from "bcrypt";
import registrationDatamapper from "../datamappers/registration.datamapper.js";
import connectionDatamapper from "../datamappers/connection.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

const controller = {
  registration: asyncHandler(async (req, res) => {
    let newUser = req.body;
    if (!newUser.email || !newUser.password || !newUser.firstname || !newUser.lastname) {
      return res.status(400).json({ message: 'Email, password, firstname and lastname are required' });
    }
    const doesUserExist = await connectionDatamapper.findByEmail(newUser.email);
    if (doesUserExist) {
      return res.status(400).json({ message: 'Email already used' });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    const userCreated = await registrationDatamapper.createUser(newUser);

    res.status(201).json(userCreated);
  })
};

export default controller;