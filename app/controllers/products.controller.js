import datamapper from '../datamappers/products.datamapper.js';

const controller = {
  getProducts: async (req, res) => {
    try {
      const category = (req.query.category);
      if (!category) {
        const data = await datamapper.getAllProducts();
        res.json(data);
      }
      else if (category) {
        if (category === 'Fruit' || category === 'Vegetable') {
          const data = await datamapper.getProductsByCategory(category);
          res.json(data);
        } else {
          res.status(400).send('Invalid category');
        }
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  getProductById: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = await datamapper.getProductById(id);
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  createProduct: async (req, res) => {
    try {
      const { latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_type } = req.body;
      const data = await datamapper.createProduct(latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_type);
      res.json(data);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  updateProduct: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const dataToUpdate = req.body;

      if (Object.keys(dataToUpdate).length === 0) {
        return res.status(400).send('No data provided to update.');
      }
      const updatedData = await datamapper.updateProduct(id, dataToUpdate);

      if (!updatedData) {
        return res.status(404).send('Product not found or no changes made.');
      }
      res.json(updatedData);

    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await datamapper.deleteProduct(id);
      res.status(204).send('Product deleted');

    } catch (error) {
      res.status(500).send(error.message);
    }
  }


};

export default controller;
