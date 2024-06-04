import datamapper from '../datamappers/products.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import fs from 'fs/promises';
import path from 'path';

const controller = {
  getProducts: asyncHandler(async (req, res) => {
    const category = req.query.category;
    if (!category) {
      const data = await datamapper.getAll();
      if (data.length === 0) {
        return res.status(404).json({ message: 'No products found.' });
      }
      res.status(200).json(data);
    } else if (category) {
      if (category === 'Fruit' || category === 'Vegetable') {
        const data = await datamapper.getProductsByCategory(category);
        res.status(200).json(data);
      } else {
        res.status(400).json({ message: 'Invalid category' });
      }
    }
  }),

  getProductById: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }
    const data = await datamapper.getById(id);
    if (!data) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(data);
  }),

  createProduct: asyncHandler(async (req, res) => {
    const { latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips } = req.body;
    let imagePath = '';

    if (!latin_name || !name || !plantation_date || !harvest_date || !soil_type || !diseases || !watering_frequency || !category_id || !description || !sowing_tips) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (picture) {
      const base64Image = picture.split(';base64,').pop();
      imagePath = path.join('public/pictures', `${name.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
      imagePath = `/pictures/${name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      console.log('Image sauvegardée avec succès à', imagePath);
    }

    const data = await datamapper.create(latin_name, name, imagePath, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips);
    res.json(data);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const dataToUpdate = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existingProduct = await datamapper.getById(id);
    if (!existingProduct) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    let updatedImagePath = existingProduct.picture;

    if (dataToUpdate.picture) {
      const base64Image = picture.split(';base64,').pop();
      updatedImagePath = path.join('public/pictures', `${dataToUpdate.name.replace(/\s+/g, '_').toLowerCase()}.jpg`);

      await fs.writeFile(updatedImagePath, base64Image, { encoding: 'base64' });
      updatedImagePath = `/pictures/${dataToUpdate.name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
      console.log('Image mise à jour avec succès à', updatedImagePath);
    }

    const updatedData = await datamapper.update(id, dataToUpdate);
    if (!updatedData) {
      return res.status(404).json({ message: 'Product not found or no changes made.' });
    }
    res.status(200).json(updatedData);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    const existedProduct = await datamapper.getById(id);
    if (!existedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await datamapper.delete(id);
    res.status(204).json('Product deleted');
  }),
};

export default controller;