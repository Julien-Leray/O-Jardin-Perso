import datamapper from '../datamappers/virtualGarden.datamapper.js';

const controller = {
  getVirtualGarden: async (req, res) => {
    try {
      const userId = req.query.id;
      const token = req.body.token;
      console.log(token);
      const data = await datamapper.getVirtualGarden(userId);
      if (data.length === 0) {
        return res.status(200).json('No products found in virtual garden.');
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Virtual garden not found" });
    }
  },

  addProduct: async (req, res) => {
    try {
      const dataToAdd = req.body;
      const data = await datamapper.addProduct(dataToAdd);

      res.status(200).json(data);

    } catch (error) {
      res.status(500).json({ message: "Failed to add product in virtual garden" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const dataToUpdate = req.body;

      if (!dataToUpdate) {
        return res.status(400).json({ message: "Data to update is required" });
      }

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).json({ message: "No data provided to update" });
      }

      const updatedData = await datamapper.updateProduct(userId, dataToUpdate);

      if (!updatedData) {
        return res.status(404).json({ message: "Product not found or no changes made" });
      }

      res.status(204).json({ message: "Product updated" });
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  },

  removeProduct: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const productToRemove = req.body.product_id;

      if (!productToRemove) {
        return res.status(400).json({ message: "Product to remove is required" });
      }
      if (!userId) {
        return res.status(400).json({ message: "User is required" });
      }

      await datamapper.removeProduct(userId, productToRemove);

      res.status(204).json({ message: "Product removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove product" });
    }
  }
};

export default controller;