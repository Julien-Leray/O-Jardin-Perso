import datamapper from "../datamappers/tutorials.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import fs from 'fs/promises';
import path from 'path';

const controller = {
  getTutorials: asyncHandler(async (req, res) => {
    const data = await datamapper.getAll();
    if (!data) {
      return res.status(404).json({ message: "Tutorials not found." });
    }
    res.status(200).json(data);
  }),

  getTutorialById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const data = await datamapper.getById(id);
    if (!data) {
      return res.status(404).json({ message: "Tutorial not found." });
    }
    res.status(200).json(data);
  }),

  createTutorial: asyncHandler(async (req, res) => {
    const tutorialToUpdate = req.body;
    let imagePath = '';

    if (tutorialToUpdate.picture) {
      const base64Image = tutorialToUpdate.picture.split(';base64,').pop();
      imagePath = path.join('public/pictures', `${tutorialToUpdate.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
      imagePath = `/pictures/${tutorialToUpdate.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      console.log('Image sauvegardée avec succès à', imagePath);
    }

    const data = await datamapper.create(tutorialToUpdate);
    res.status(201).json(data);
  }),

  updateTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const dataToUpdate = req.body;
    const existingTutorial = await datamapper.getById(id);

    if (!existingTutorial) {
      return res.status(404).json({ message: 'Tutorial not found.' });
    }

    let updatedImagePath = existingTutorial.picture;

    if (dataToUpdate.picture) {
      const base64Image = picture.split(';base64,').pop();
      updatedImagePath = path.join('public/pictures', `${dataToUpdate.title.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(updatedImagePath, base64Image, { encoding: 'base64' });
      updatedImagePath = `/pictures/${dataToUpdate.title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    }

    if (updatedImagePath) {
      dataToUpdate.picture = updatedImagePath;
    }

    const updatedData = await datamapper.update(id, dataToUpdate);
    if (!updatedData) {
      return res.status(404).json({ message: "Tutorial not found or no changes made." });
    }

    res.status(200).json(updatedData);
  }),

  deleteTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existingTutorial = await datamapper.getById(id);
    if (!existingTutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    await datamapper.delete(id);
    res.status(204).send('Tutorial deleted');
  }),
};

export default controller;
