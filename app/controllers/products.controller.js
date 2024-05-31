import datamapper from '../datamappers/products.datamapper.js';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import fs from 'fs/promises';
import path from 'path';

const controller = {
  getProducts: asyncHandler(async (req, res) => {
    const category = (req.query.category);
    if (!category) {
      const data = await datamapper.getAllProducts();
      if (data.length === 0) {
        return res.status(404).json({ message: 'No products found.' });
      }
      res.statut(200).json(data);
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

    if (!id) {
      return res.status(400).json({ message: 'Invalid id' });
    }

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

    // Vérifiez si une image est incluse dans la requête
    if (picture) {
      const base64Image = picture.split(';base64,').pop();
      imagePath = path.join('public/pictures', `${name.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le nom du produit

      try {
        await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
        imagePath = `/pictures/${name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        console.log('Image sauvegardée avec succès à', imagePath);
      } catch (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
      }
    }
    // console.log(picture)
    // Créer le produit avec le chemin de l'image
    try {
      const data = await datamapper.createProduct(latin_name, name, imagePath, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips);
      res.json(data);
    } catch (error) {
      console.error('Erreur lors de la création du produit :', error);
      res.status(500).json({ message: 'Erreur lors de la création du produit.' });
    }
  }),


  updateProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const { latin_name, name, picture, plantation_date, harvest_date, soil_type, diseases, watering_frequency, category_id, description, sowing_tips } = req.body;
    let updatedImagePath = '';

    if (!id) {
      return res.status(400).json({ message: 'Invalid id' });
    }

    if (dataToUpdate.length < 1) {
      return res.status(400).json({ message: 'At least one field required' });
    }

    // Vérifiez si une image est incluse dans la requête
    if (picture) {
      const base64Image = picture.split(';base64,').pop();
      updatedImagePath = path.join('public/pictures', `${name.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le nom du produit

      try {
        await fs.writeFile(updatedImagePath, base64Image, { encoding: 'base64' });
        updatedImagePath = `/pictures/${name.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        console.log('Image mise à jour avec succès à', updatedImagePath);
      } catch (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
      }
    }

    const dataToUpdate = {
      latin_name,
      name,
      plantation_date,
      harvest_date,
      soil_type,
      diseases,
      watering_frequency,
      category_id,
      description,
      sowing_tips,

    };

    // Inclure le chemin de l'image mise à jour si elle existe
    if (updatedImagePath) {
      dataToUpdate.picture = updatedImagePath;
    }

    try {
      const updatedData = await datamapper.updateProduct(id, dataToUpdate);
      if (!updatedData) {
        return res.status(404).json({ message: 'Product not found or no changes made.' });
      }
      res.status(200).json(updatedData);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit :', error);
      res.status(500).json({ message: 'Erreur lors de la mise à jour du produit.' });
    }
  }),


  deleteProduct: asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    const existedProduct = await datamapper.getProductById(id);
    if (!existedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await datamapper.deleteProduct(id);
    res.status(204).json('Product deleted');
  }),

};

export default controller;
