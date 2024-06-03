import '../../test.config.js';

import { describe, it, before } from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../index.app.js';




describe('Products API', () => {
  describe('GET /api/products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/products');

      assert.strictEqual(response.status, 200);
      assert(Array.isArray(response.body));
    });

    it('should return all products of a specific category', async () => {
      const categoryId = 'Fruit';
      const response = await request(app).get(`/api/products?category=${categoryId}`);

      assert.strictEqual(response.status, 200);
      assert(Array.isArray(response.body));
    });

    it('should return an error if the category is invalid', async () => {
      const invalidCategory = 'invalid';
      const response = await request(app).get(`/api/products?category=${invalidCategory}`);

      assert.strictEqual(response.status, 400);
      assert(response.body.hasOwnProperty('message'));
    });
  });

  describe('GET /api/products/:id', () => {
    it('should return a specific product', async () => {
      const response = await request(app).get('/api/products/1');

      assert.strictEqual(response.status, 200);
      assert.strictEqual(typeof response.body, 'object');
    });

    it('should return an error if the id is invalid', async () => {
      const response = await request(app).get('/api/products/invalid');

      assert.strictEqual(response.status, 400);
      assert(response.body.hasOwnProperty('message'));
    });

    it('should return an error if the product is not found', async () => {
      const response = await request(app).get('/api/products/9999');

      assert.strictEqual(response.status, 404);
      assert(response.body.hasOwnProperty('message'));
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        latin_name: 'hfhf',
        name: 'djrjrj',
        picture: 'thfhf',
        plantation_date: 'gdgdgdg',
        harvest_date: 'dgudgvu',
        soil_type: 'zdluhvcz',
        diseases: 'zljuhvcz',
        watering_frequency: 'czibvc',
        category_id: 1,
        description: 'khdbc',
        sowing_tips: 'zdljhvuzce'
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(productData);

      assert.strictEqual(response.status, 201);
      assert(response.body.hasOwnProperty('id'));
    });
  });

  describe('PATCH /api/products/:id', () => {
    it('should update a product', async () => {
      const productData = {
        latin_name: 'hello',
      };

      const response = await request(app)
        .patch('/api/products/1')
        .set('Authorization', `Bearer ${global.authToken}`)
        .send(productData);

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.id, 1);
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete a product', async () => {
      const response = await request(app)
        .delete('/api/products/1')
        .set('Authorization', `Bearer ${global.authToken}`);

      assert.strictEqual(response.status, 204);

    });
  });

});

