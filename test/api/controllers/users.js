const should = require('should');
const request = require('supertest');
const server = require('../../../app');
const User = require('../../../api/dataObjects/user.js');

describe('controllers', function() {

  describe('users', function() {

    describe('GET /user', function() {
      before(async () => {
        let user = new User(true);
        await user.removeAll();
        await user.create('Moshe Zuchmir','m@m.com','DDD 12 KV', 'dddddddddd');
      }) 
      it('should return an error', function(done) {

        request(server)
          .get('/user')
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400)
          .end(function(err, res) {       

            res.body.message.should.eql('Validation errors');

            done();
          });
      });

      it('should accept a id parameter', function(done) {
        request(server)
          .get('/user')
          .query({ id: 1})
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end(function(err, res) {
            should.not.exist(err);

            res.body.id.should.eql(1);
            res.body.name.should.eql('Moshe Zuchmir');


            done();
          });
      });

    });

  });

});
