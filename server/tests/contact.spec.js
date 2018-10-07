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

  after((done) => {
    db.Contact.destroy({ where: {} })
    .then(done());
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

  describe('GET Contact GET /api/contact', () => {

    it('it should get a contact when it exists', (done) => {
      superRequest.get(`/api/contact?contactId=${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Contact successfully retrieved');
          expect(res.body.data.contact.name).to.equal('Owonikoko Oluwaseun');
          expect(res.body.data.contact.phoneNumber).to.equal('090876754365');
          done();
        });
    });

    it('it should not get a contact if it does not exist', (done) => {
      superRequest.get('/api/contact?contactId=99999999999')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Contact not found');
          done();
        });
    });

    it('it should not get a contact if contactId is invalid', (done) => {
      superRequest.get('/api/contact?contactId=invalid')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Parameter contactId not valid');
          done();
        });
    });
  });

  describe('GET All Contacts GET /api/contacts', () => {

    it('it should get all contacts successfully', (done) => {
      superRequest.get('/api/contacts')
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Contacts successfully retrieved');
          expect(res.body.data.contacts.length).to.be.greaterThan(0);
          done();
        });
    });
  });

  describe('EDIT Contacts PUT /api/contact', () => {

    it('it should edit a single contact successfully', (done) => {
      superRequest.put(`/api/contact?contactId=${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Hajarat',
          phoneNumber: '07083445523'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Contact successfully updated');
          expect(res.body.data.contact.name).to.equal('Owonikoko Hajarat');
          expect(res.body.data.contact.phoneNumber).to.equal('07083445523');
          done();
        });
    });

    it('it should fail for Invalid contact', (done) => {
      superRequest.put('/api/contact?contactId=9999')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Hajarat',
          phoneNumber: '07083445523'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Contact not found');
          done();
        });
    });
  });

  describe('DELETE Contacts DELETE /api/contact', () => {

    it('it should delete single contact successfully', (done) => {
      superRequest.delete(`/api/contact?contactId=${testContact.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Contact successfully deleted');
          expect(res.body.data.contact).to.be.empty;
          done();
        });
    });

    it('it should fail for Invalid contact', (done) => {
      superRequest.delete('/api/contact?contactId=9999')
        .set({ 'content-type': 'application/json' })
        .send({ 
          name: 'Owonikoko Hajarat',
          phoneNumber: '07083445523'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Contact not found');
          done();
        });
    });
  });
});

