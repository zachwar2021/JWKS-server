const request = require('supertest');
const assert = require('assert');
const {app,server} = require('./server');


//first set of tests
describe('Testing Express App Endpoints', () => {

    //tests for a JWKS from the JWKS endpoint
  it('should return JWKS when accessing /.well-known/jwks.json', (done) => {
    request(app)
      .get('/.well-known/jwks.json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.keys && res.body.keys.length === 1, 'Invalid JWKS response');
        done();
      });
  });
  
  //tests for a token form the /auth endpoint
  it('should return a valid token when accessing /auth with POST request', (done) => {
    request(app)
      .post('/auth')
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        assert(res.body.token, 'Token not found in the response');
        done();
      });
  });
});

//second set od tests
describe('Express App Tests', () => {
    //testing a 200 code from the JWKS endpoint
    it('should return a valid response for JWKS endpoint', (done) => {
        request(app)
          .get('/.well-known/jwks.json')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
      
            assert(res.body.keys, 'Keys not found in the response');
            
            done();
          });
      });
  
      //testing a 200 code and JWT from the /auth POST endpoint
      it('should return a valid JWT token for /auth endpoint (POST)', (done) => {
        request(app)
          .post('/auth')
          .expect('Content-Type', /json/)
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
      
            assert(res.body.token, 'Token not found in the response');
            
            done();
          });
      });
      
      //tests a 405 code for unautherized access to /auth
      it('should return "Method Not Allowed" for unauthorized access to /auth', (done) => {
        request(app)
          .get('/auth')
          .expect(405)
          .end(done);
      });
      
      // tests for 405 code on unautherized acces to put, delete, pathc, and head of the /auth endpoints
      it('should return "Method Not Allowed" for /auth endpoint (PUT, DELETE, PATCH, HEAD)', (done) => {
        const methods = ['put', 'delete', 'patch', 'head'];
        let count = 0;
      
        for (const method of methods) {
          request(app)
            [method]('/auth')
            .expect(405)
            .end((err, res) => {
              if (err) return done(err);
              count++;
      
              if (count === methods.length) {
                done();
              }
            });
        }
      });

      // test for 405 code on unautherized acces to put, delete, patach, and post for the JWKS endpoints 
      it('should return "Method Not Allowed" for JWKS endpoint (PUT, DELETE, PATCH, POST)', (done) => {
        const methods = ['put', 'delete', 'patch', 'post'];
        let count = 0;
      
        for (const method of methods) {
          request(app)
            [method]('/.well-known/jwks.json')
            .expect(405)
            .end((err, res) => {
              if (err) return done(err);
              count++;
      
              if (count === methods.length) {
                done();
              }
            });
        }
      });
      
      //test for 404 code on invalid routes
      it('should return 404 for invalid routes', (done) => {
        request(app)
          .get('/invalid-route')
          .expect(404)
          .end(done);
      });
      
});

    //called after all the test have comcluded and ends the program
    after((done) => {
        // Close the server after all tests
        server.close(() => {
            console.log('Server closed.');
            done();
        });
  });

