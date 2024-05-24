import datamapper from "../datamappers/tutorials.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";

const controller = {
  getTutorials: asyncHandler(async (req, res) => {
    const data = await datamapper.getAllTutorials();
    if (!data) {
      return res.status(404).json({ message: "Tutorials not found." });
    }
    res.status(200).json(data);
  }),

  getTutorialById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const data = await datamapper.getTutorialById(id);

    if (!data) {
      return res.status(404).json({ message: "Tutorial not found." });
    }
    res.status(200).json(data);
  }),

  createTutorial: asyncHandler(async (req, res) => {
    const { title, article, picture, theme } = req.body;
    const data = await datamapper.createTutorial(title, article, picture, theme);
    res.status(201).json(data);
  }),

  updateTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const dataToUpdate = req.body;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: "No data provided to update." });
    }

    const updatedData = await datamapper.updateTutorial(id, dataToUpdate);

    if (!updatedData) {
      return res.status(404).json({ message: "Tutorial not found or no changes made." });
    }

    res.status(200).json(updatedData);
  }),

  deleteTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await datamapper.deleteTutorial(id);
    res.status(204).send('Tutorial deleted');
  }),
};

export default controller;