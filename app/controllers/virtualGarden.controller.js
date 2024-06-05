import datamapper from '../datamappers/virtualGarden.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';

const controller = {
  getVirtualGarden: asyncHandler(async (req, res) => {
    const userId = req.userId;
    const data = await datamapper.getVirtualGarden(userId);
    if (data.length === 0) {
      return res.status(200).json({ message: 'No products found in virtual garden.' });
    }
    res.status(200).json(data);
  }),

  addProduct: asyncHandler(async (req, res) => {
    const dataToAdd = req.body;
    const userId = req.userId;
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

    if (!userId) {
      return res.status(400).json({ message: "User is required" });
    }

    const data = await datamapper.addProduct(dataToAdd, userId);

    res.status(201).json(data);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const dataToUpdate = req.body;

    if (userId !== req.userId || !userId) {
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
  }),

  removeProduct: asyncHandler(async (req, res) => {
    const userId = parseInt(req.params.id);
    const productToRemove = req.body.product_id;

    if (!productToRemove) {
      return res.status(400).json({ message: "Product to remove is required" });
    }
    if (userId !== req.userId || !userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    await datamapper.removeProduct(userId, productToRemove);

    res.status(204).json({ message: "Product removed" });
  })
};

export default controller;