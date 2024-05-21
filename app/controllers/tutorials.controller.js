import datamapper from "../datamappers/tutorials.datamapper.js";

const controller = {
  getTutorials: async (req, res) => {
    try {
      const data = await datamapper.getAllTutorials();
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Tutorial not found" });
    }
  },

  getTutorialById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await datamapper.getTutorialById(id);

      if (!data) {
        return res.status(404).json({ message: "Tutorial not found." });
      }
      res.status(200).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Tutorials not found" });
    }
  },

  createTutorial: async (req, res) => {
    try {
      const { title, article, picture, theme } = req.body;
      const data = await datamapper.createTutorial(title, article, picture, theme);
      res.status(201).json(data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to create new tutorial" });
    }
  },

  updateTutorial: async (req, res) => {
    try {
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
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to update tutorial" });
    }
  },

  deleteTutorial: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await datamapper.deleteTutorial(id);
      res.status(204).send('Tutorial deleted');
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Failed to delete tutorial" });
    }
  },
};

export default controller;