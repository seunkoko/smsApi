import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testSenderContact;
let testReceiverContact;

describe('SMS API', () => {
  before((done) => {
    db.Contact.create({
      name: 'Owonikoko Oluwaseun',
      phoneNumber: '090876754365'
    })
    .then((senderContact) => {
      testSenderContact = senderContact.dataValues;
      
      db.Contact.create({
        name: 'Owonikoko Sherifat',
        phoneNumber: '09092822265'
      })
      .then((receiverContact) => {
        testReceiverContact = receiverContact.dataValues;
        done();
      });
    });
  });

  after((done) => {
    db.Sms.destroy({ 
      where: {}
    })
    .then(() => {
      db.Contact.destroy({ where: {} })
      .then(done());
    })
  });

  describe('CREATE Sms POST /api/sms', () => {

    it('it should create (send) sms successfully', (done) => {
      superRequest.post(`/api/sms?contactId=${testSenderContact.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ 
          message: 'I heart you',
          recipientNumber: testReceiverContact.phoneNumber
        })
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Sms successfully created');
          expect(res.body.data.sms.message).to.be.equal('I heart you');
          expect(res.body.data.sms.receiverId).to.be.equal(testReceiverContact.id);
          expect(res.body.data.sms.senderId).to.be.equal(testSenderContact.id);
          expect(res.body.data.sms.smsStatus).to.be.equal('delivered');
          done();
        });
    });

    it('it should not create (send) sms when contactId is not valid', (done) => {
      superRequest.post('/api/sms?contactId=999999')
        .set({ 'content-type': 'application/json' })
        .send({ 
          message: 'I heart you',
          recipientNumber: testReceiverContact.phoneNumber
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Sender contact not found');
          done();
        });
    });

    it('it should not create (send) sms when recipientNumber is not valid', (done) => {
      superRequest.post(`/api/sms?contactId=${testSenderContact.id}`)
        .set({ 'content-type': 'application/json' })
        .send({ 
          message: 'I heart you',
          recipientNumber: '000000000000'
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Recipient contact not found');
          done();
        });
    });
  });
});