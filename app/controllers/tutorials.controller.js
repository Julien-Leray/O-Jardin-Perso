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
    const data = await datamapper.getTutorialById(id);

    if (!data) {
      return res.status(404).json({ message: "Tutorial not found." });
    }
    res.status(200).json(data);
  }),

  createTutorial: asyncHandler(async (req, res) => {
    const { title, article, picture, theme } = req.body;
    let imagePath = '';

    // Vérifiez si une image est incluse dans la requête
    if (picture) {
        const base64Image = picture.split(';base64,').pop();
        imagePath = path.join('public/pictures', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le titre du tutoriel

        try {
            await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
            imagePath = `/pictures/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
            console.log('Image sauvegardée avec succès à', imagePath);
        } catch (err) {
            console.error('Erreur lors de l\'écriture du fichier :', err);
            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
        }
    }

    // Créer le tutoriel avec le chemin de l'image
    try {
        const data = await datamapper.createTutorial(title, article, imagePath, theme);
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la création du tutoriel :', error);
        res.status(500).json({ message: 'Erreur lors de la création du tutoriel.' });
    }
}),


updateTutorial: asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, article, picture, theme } = req.body;
  let updatedImagePath = '';

  if (picture) {
      const base64Image = picture.split(';base64,').pop();
      updatedImagePath = path.join('public/pictures', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le titre du tutoriel

      try {
          await fs.writeFile(updatedImagePath, base64Image, { encoding: 'base64' });
          updatedImagePath = `/pictures/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
          console.log('Image mise à jour avec succès à', updatedImagePath);
      } catch (err) {
          console.error('Erreur lors de l\'écriture du fichier :', err);
          return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
      }
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

  try {
      const updatedData = await datamapper.updateTutorial(id, dataToUpdate);
      if (!updatedData) {
          return res.status(404).json({ message: "Tutorial not found or no changes made." });
      }

      res.status(200).json(updatedData);
  } catch (error) {
      console.error('Erreur lors de la mise à jour du tutoriel :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du tutoriel.' });
  }
}),

  deleteTutorial: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    await datamapper.deleteTutorial(id);
    res.status(204).send('Tutorial deleted');
  }),
};

export default controller;