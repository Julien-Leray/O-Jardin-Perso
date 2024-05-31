import app from '../index.app.js';
import { expect } from 'chai';

chai.use(chaiHttp);

describe('Products API', () => {

  it('should get all products', (done) => {
    chai.request(app)
      .get('/api/products')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('array');
        done();
      });
  });

  it('should create a new product', (done) => {
    chai.request(app)
      .post('/api/products')
      .set('Authorization', 'Bearer token') // Ajouter un token valide si nécessaire
      .send({
        name: 'Courgette',
        latin_name: 'Cucurbita Pepo',
        picture: 'path/to/picture.jpg',
        plantation_date: '2022-03-01',
        harvest_date: '2022-06-01',
        soil_type: 'Loamy',
        diseases: 'None',
        watering_frequency: 'Weekly',
        description: 'A healthy vegetable.',
        sowing_tips: 'Sow in rich soil.',
        category_id: 1
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Courgette');
        done();
      });
  });

  it('should get a product by id', (done) => {
    chai.request(app)
      .get('/api/products/1')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.id).to.equal(1);
        done();
      });
  });

  it('should update a product by id', (done) => {
    chai.request(app)
      .patch('/api/products/1')
      .set('Authorization', 'Bearer token') // Ajouter un token valide si nécessaire
      .send({ name: 'Courgette Updated' })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.name).to.equal('Courgette Updated');
        done();
      });
  });

  it('should delete a product by id', (done) => {
    chai.request(app)
      .delete('/api/products/1')
      .set('Authorization', 'Bearer token') // Ajouter un token valide si nécessaire
      .end((err, res) => {
        expect(res).to.have.status(204);
        done();
      });
  });
});

