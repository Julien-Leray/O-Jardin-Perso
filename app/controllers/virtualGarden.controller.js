import datamapper from '../datamappers/virtualGarden.datamapper.js';
import jwt from 'jsonwebtoken';

const controller = {
  getVirtualGarden: async (req, res) => {
    try {

      const token = req.body.token;
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      console.log(userId);

      const data = await datamapper.getVirtualGarden(userId);
      if (data.length === 0) {
        return res.status(200).json({ message: 'No products found in virtual garden.' });
      }
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: "Virtual garden not found" });
    }
  },

  addProduct: async (req, res) => {
    try {
      const dataToAdd = req.body;
      const token = req.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const product_id = req.body.product_id;

      const userProduct = await datamapper.getOneVirtualGardenProduct(userId, product_id);

      if (userProduct) {
        const quantity = Number(userProduct.quantity) + Number(dataToAdd.quantity);
        dataToAdd.quantity = quantity;
        const updatedProduct = await datamapper.updateProduct(userId, dataToAdd);
        return res.status(200).json(updatedProduct);
      }

      if (!dataToAdd) {
        return res.status(400).json({ message: "Data to add is required" });
      }
      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      if (!userId) {
        return res.status(400).json({ message: "User is required" });
      }

      const data = await datamapper.addProduct(dataToAdd, userId);

      res.status(201).json(data);

    } catch (error) {
      res.status(500).json({ message: "Failed to add product in virtual garden" });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const dataToUpdate = req.body;
      const token = req.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (userId !== decoded.id || !userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

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
      res.status(201).json(updatedData);

    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  },

  removeProduct: async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const productToRemove = req.body.product_id;
      const token = req.body.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (!productToRemove) {
        return res.status(400).json({ message: "Product to remove is required" });
      }
      if (userId !== decoded.id || !userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      await datamapper.removeProduct(userId, productToRemove);

      res.status(204).json({ message: "Product removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove product" });
    }
  }
};

export default controller;