import '../../test.config.js';

import { describe, it, before } from 'mocha';
import assert from 'assert';
import request from 'supertest';
import app from '../index.app.js';



describe('GET /api/tutorials', () => {
  it('should return all tutorials', async () => {
    const response = await request(app)
      .get('/api/tutorials')


    assert.strictEqual(response.status, 200);
    assert(Array.isArray(response.body));
  });
});

describe('GET /api/tutorials/:id', () => {
  it('should return one tutorial', async () => {
    const response = await request(app)
      .get('/api/tutorials/1')


    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.id, 1);
  });
});

describe('POST /api/tutorials', () => {
  it('should create a tutorial', async () => {
    const tutorial = {
      title: 'Test',
      article: 'Test',
      picture: 'test.jpg',
      theme: 'Test',
    }

    const response = await request(app)
      .post('/api/tutorials')
      .set('Authorization', `Bearer ${global.authToken}`)
      .send(tutorial);

    assert.strictEqual(response.status, 201);
    assert.strictEqual(response.body.title, 'Test');
  });
});

describe('PATCH /api/tutorials/:id', () => {
  it('should update a tutorial', async () => {
    const tutorial = {
      title: 'TestUpdated',

    }

    const response = await request(app)
      .patch('/api/tutorials/1')
      .set('Authorization', `Bearer ${global.authToken}`)
      .send(tutorial);

    assert.strictEqual(response.status, 200);
    assert.strictEqual(response.body.title, 'TestUpdated');
  });
});

describe('DELETE /api/tutorials/:id', () => {
  it('should delete a tutorial', async () => {
    const response = await request(app)
      .delete('/api/tutorials/1')
      .set('Authorization', `Bearer ${global.authToken}`);

    assert.strictEqual(response.status, 204);
  });
});