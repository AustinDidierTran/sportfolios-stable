process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

const server = require('../src/server');
const knex = require('../src/server/db/connection');

const expectedKeys = [
  'id',
  'name',
  'sport',
  'memberLimit',
  'isDeleted',
];

describe('routes : associations', () => {
  beforeEach(() => {
    return knex.migrate
      .rollback()
      .then(() => {
        return knex.migrate.latest();
      })
      .then(() => {
        return knex.seed.run();
      });
  });

  afterEach(() => {
    return knex.migrate.rollback();
  });

  describe('GET /api/associations', () => {
    it('should return all associations', done => {
      chai
        .request(server)
        .get('/api/associations')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data.length.should.eql(3);
          res.body.data[0].should.include.keys(...expectedKeys);
          done();
        });
    });
  });

  describe('GET /api/associations/:id', () => {
    it('should respond with a single association', done => {
      chai
        .request(server)
        .get('/api/associations/1')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(200);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(...expectedKeys);
          done();
        });
    });

    it('should throw an error if the association does not exist', done => {
      chai
        .request(server)
        .get('/api/associations/9999999')
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(404);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          res.body.message.should.eql('That record does not exist.');
          done();
        });
    });
  });

  describe('POST /api/associations', () => {
    it('should return the association that was added', done => {
      chai
        .request(server)
        .post('/api/associations')
        .send({
          name: "Association d'ultimate d'Orford",
          sport: 'Ultimate Frisbee',
          memberLimit: 8,
          isDeleted: false,
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(201);
          res.type.should.equal('application/json');
          res.body.status.should.eql('success');
          res.body.data[0].should.include.keys(...expectedKeys);
          done();
        });
    });

    it('should throw an error if the payload is malformed', done => {
      chai
        .request(server)
        .post('/api/associations')
        .send({
          name: "Association d'ultimate de Orford",
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(400);
          res.type.should.equal('application/json');
          res.body.status.should.eql('error');
          should.exist(res.body.message);
          done();
        });
    });
  });

  describe('PUT /api/associations', () => {
    it('should return the association that was updated', done => {
      knex('associations')
        .select('*')
        .then(association => {
          const associationObject = association[0];
          console.log('associationObject', associationObject);
          chai
            .request(server)
            .put(`/api/associations/${associationObject.id}`)
            .send({
              memberLimit: 50,
            })
            .end((err, res) => {
              should.not.exist(err);
              res.status.should.equal(200);
              res.type.should.equal('application/json');
              res.body.status.should.eql('success');
              res.body.data[0].should.include.keys(...expectedKeys);
              const newAssociationObject = res.body.data[0];
              newAssociationObject.memberLimit.should.not.eql(
                associationObject.memberLimit,
              );
              done();
            });
        });
    });
    it('should throw an error if the association does not exist', done => {
      chai
        .request(server)
        .put('/api/association/9999999')
        .send({
          rating: 9,
        })
        .end((err, res) => {
          should.not.exist(err);
          res.status.should.equal(404);
          res.type.should.equal('text/plain');
          // res.body.status.should.eql('error');
          // res.body.message.should.eql('That association does not exist.');
          done();
        });
    });
  });

  describe('DELETE /api/associations/:id', () => {
    it('should return the association that was deleted', done => {
      knex('associations')
        .select('*')
        .then(associations => {
          const associationObject = associations[0];
          const lengthBeforeDelete = associations.length;
          chai
            .request(server)
            .delete(`/api/associations/${associationObject.id}`)
            .end((err, res) => {
              // there should be no errors
              should.not.exist(err);
              // there should be a 200 status code
              res.status.should.equal(200);
              // the response should be JSON
              res.type.should.equal('application/json');
              // the JSON response body should have a
              // key-value pair of {"status": "success"}
              res.body.status.should.eql('success');
              // the JSON response body should have a
              // key-value pair of {"data": 1 association object}
              res.body.data[0].should.include.keys(...expectedKeys);
              // ensure the association was in fact deleted
              knex('associations')
                .select('*')
                .then(updatedAssociations => {
                  updatedAssociations.length.should.eql(
                    lengthBeforeDelete - 1,
                  );
                  done();
                });
            });
        });
    });
    it('should throw an error if the association does not exist', done => {
      chai
        .request(server)
        .delete('/api/associations/9999999')
        .end((err, res) => {
          // there should an error
          should.not.exist(err);
          // there should be a 404 status code
          res.status.should.equal(404);
          // the response should be JSON
          res.type.should.equal('application/json');
          // the JSON response body should have a
          // key-value pair of {"status": "error"}
          res.body.status.should.eql('error');
          // the JSON response body should have a
          // key-value pair of {"message": "That association does not exist."}
          res.body.message.should.eql(
            'That association does not exist.',
          );
          done();
        });
    });
  });
});
