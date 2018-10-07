import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testContact;

describe('CONTACT API', () => {
  before((done) => {
    db.Contact.create({
      name: 'Owonikoko Oluwaseun',
      phoneNumber: '090876754365'
    })
    .then((contact) => {
      testContact = contact.dataValues;
      done();
    });
  });

  after(() => {
    db.Contact.destroy({ where: {} });
  });

  describe('CREATE Contact POST /api/contact', () => {

    it('it should create a new contact when data is valid', (done) => {
      superRequest.post('/api/contact')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Yetunde',
          phoneNumber: '09063000009'
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Contact successfully created');
          expect(res.body.data.contact.name).to.equal('Owonikoko Yetunde');
          expect(res.body.data.contact.phoneNumber).to.equal('09063000009');
          done();
        });
    });

    it('it should not create a contact with the same phoneNumber', (done) => {
      superRequest.post('/api/contact')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Omolola',
          phoneNumber: testContact.phoneNumber
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('phoneNumber must be unique');
          expect(res.body.data.type).to.equal('unique violation');
          done();
        });
    });

    it('it should not create a contact with empty name', (done) => {
      superRequest.post('/api/contact')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: '',
          phoneNumber: '09073661111'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.data.message).to
            .equal('Name (name) field is required');
          done();
        });
    });

    it('it should not create a contact with empty phoneNumber', (done) => {
      superRequest.post('/api/contact')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Mariam',
          phoneNumber: ''
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.data.message).to
            .equal('Phone number (phoneNumber) field is required');
          done();
        });
    });

    it('it should not create a phoneNumber with invalid type', (done) => {
      superRequest.post('/api/contact')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Mariam',
          phoneNumber: 'invalid'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('error');
          expect(res.body.data.message).to
            .equal('Invalid Phone Number');
          done();
        });
    });
  });

});

