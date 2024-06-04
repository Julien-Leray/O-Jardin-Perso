import datamapper from "../datamappers/tutorials.datamapper.js";
import asyncHandler from "../middlewares/asyncHandler.middleware.js";
import fs from 'fs/promises';
import path from 'path';

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
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const data = await datamapper.getTutorialById(id);
    if (!data) {
      return res.status(404).json({ message: "Tutorial not found." });
    }
    res.status(200).json(data);
  }),

  createTutorial: asyncHandler(async (req, res) => {
    const { title, article, picture, theme } = req.body;
    let imagePath = '';

    if (picture) {
      const base64Image = picture.split(';base64,').pop();
      imagePath = path.join('public/pictures', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
      imagePath = `/pictures/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      console.log('Image sauvegardée avec succès à', imagePath);
    }

    const data = await datamapper.createTutorial(title, article, imagePath, theme);
    res.json(data);
  }),

  updateTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const { title, article, picture, theme } = req.body;
    const existingTutorial = await datamapper.getTutorialById(id);
    if (!existingTutorial) {
      return res.status(404).json({ message: 'Tutorial not found.' });
    }

    let updatedImagePath = existingTutorial.picture;

    if (picture) {
      const base64Image = picture.split(';base64,').pop();
      updatedImagePath = path.join('public/pictures', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(updatedImagePath, base64Image, { encoding: 'base64' });
      updatedImagePath = `/pictures/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      console.log('Image mise à jour avec succès à', updatedImagePath);
    }

    const dataToUpdate = {
      title,
      article,
      theme,
      updated_at: new Date().toISOString()
    };

    if (updatedImagePath) {
      dataToUpdate.picture = updatedImagePath;
    }

    const updatedData = await datamapper.updateTutorial(id, dataToUpdate);
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

    const existingTutorial = await datamapper.getTutorialById(id);
    if (!existingTutorial) {
      return res.status(404).json({ message: 'Tutorial not found' });
    }

    await datamapper.deleteTutorial(id);
    res.status(204).send('Tutorial deleted');
  }),
};

export default controller;
