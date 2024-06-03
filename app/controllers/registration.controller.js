import bcrypt from "bcrypt";
import registrationDatamapper from "../datamappers/registration.datamapper.js";
import connectionDatamapper from "../datamappers/connection.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import joi from "joi";

const userSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(6).required(),
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  address: joi.string().optional(),
  zip_code: joi.string().pattern(/^0[1-9]\d{3}$|^[1-8]\d{4}$|^9[0-5]\d{3}$|^97[0-5]\d{2}$|^98[6-8]\d{2}$|^98000$/).optional(),
  city: joi.string().optional(),

});

const controller = {
  registration: asyncHandler(async (req, res) => {

    const { error, value: newUser } = userSchema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({ message: 'Invalid input', details: error.details });
    }
    const doesUserExist = await connectionDatamapper.findByEmail(newUser.email);
    if (doesUserExist) {
      return res.status(400).json({ message: 'Email already used' });
    }
    const hashedPassword = await bcrypt.hash(newUser.password, 10);
    newUser.password = hashedPassword;
    newUser.is_admin = false;
    const userCreated = await registrationDatamapper.createUser(newUser);

    res.status(201).json(userCreated);
  }),

  doesEmailExist: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await connectionDatamapper.findByEmail(email);
    if (user) {
      res.status(200).json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  }),
};

export default controller;