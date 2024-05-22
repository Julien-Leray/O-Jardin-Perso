import datamapper from '../datamappers/products.datamapper.js';

const controller = {
    renderAdminPage: async (req, res) => {
      try {
        res.render('products');
      } catch (error) {
        res.status(500).send(error.message);
      }
    }}

    export default controller;