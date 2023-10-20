const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../Server'); // Import your Express app
const should = chai.should();
const expect = chai.expect;

chai.use(chaiHttp);

describe('To-Do Module', () => {
    // Your test cases here
    it('should get a list of to-dos', (done) => {
        chai.request(app)
            .get('/api/todos')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('object');
                expect(res.body).to.have.property('message').that.equals('Get Todos');
                done();
            });
    });

    // Additional test cases
    it('should create a new to-do', (done) => {
        chai.request(app)
            .post('/api/todos')
            .send({ todo: 'Test Todo' })
            .end((err, res) => {
                // Your assertions for creating a new to-do
                done();
            });
    });

    // Add more test cases as needed
});
