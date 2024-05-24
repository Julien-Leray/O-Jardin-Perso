import datamapper from '../datamappers/products.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';

const controller = {
  getProducts: asyncHandler(async (req, res) => {
    const category = (req.query.category);
    if (!category) {
      const data = await datamapper.getAllProducts();
      res.json(data);
    }
    else if (category) {
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
    const data = await datamapper.getProductById(id);

    if (!data) {
      return res.status(404).json({ message: 'Product not found.' });
    }
    res.json(data);

  }),

  createProduct: asyncHandler(async (req, res) => {
    const { latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_type } = req.body;
    const data = await datamapper.createProduct(latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_type);
    res.json(data);
  }),

  updateProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const dataToUpdate = req.body;

    if (Object.keys(dataToUpdate).length === 0) {
      return res.status(400).json({ message: 'No data provided to update.' });
    }
    const updatedData = await datamapper.updateProduct(id, dataToUpdate);

    if (!updatedData) {
      return res.status(404).json({ message: 'Product not found or no changes made.' });
    }
    res.status(204).json(updatedData);
  }),

  deleteProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const existedProduct = await datamapper.getProductById(id);
    if (!existedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await datamapper.deleteProduct(id);
    res.status(204).json('Product deleted');
  })


};

export default controller;
