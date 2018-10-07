import request from 'supertest';
import chai from 'chai';
import app from '../../app';
import db from '../models';

const superRequest = request.agent(app);
const expect = chai.expect;

let testSenderContact;
let testReceiverContact;
let testSms1;
let testSms2;

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

        db.Sms.create({
          message: 'I heart you',
          recipientNumber: testReceiverContact.phoneNumber,
          senderId: testSenderContact.id,
          receiverId: testReceiverContact.id
        })
        .then((firstSms) => {
          testSms1 = firstSms.dataValues;
          
          db.Sms.create({
            message: 'I hate you',
            recipientNumber: testReceiverContact.phoneNumber,
            senderId: testSenderContact.id,
            receiverId: testReceiverContact.id
          })
          .then((secondSms) => {
            testSms2 = secondSms.dataValues;

            done();
          });
        });
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

  describe('DELETE Sms DELETE /api/sms', () => {

    it('it should delete sms successfully if contactId is sender', (done) => {
      superRequest.delete(`/api/sms?contactId=${testSenderContact.id}&smsId=${testSms1.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          console.log(res.body)
          expect(res.status).to.equal(200);
          expect(res.body.status).to.equal('success');
          expect(res.body.data.message).to
            .equal('Sms succesfully deleted');
          expect(res.body.data.sms).to.be.empty;
          done();
        });
    });

    it('it should not delete sms if contactId is not sender', (done) => {
      superRequest.delete(`/api/sms?contactId=${testReceiverContact.id}&smsId=${testSms2.id}`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('You are not authorized to delete this message');
          done();
        });
    });

    it('it should fail if smsId does not exist', (done) => {
      superRequest.delete(`/api/sms?contactId=${testReceiverContact.id}&smsId=9999`)
        .set({ 'content-type': 'application/json' })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(res.body.status).to.equal('fail');
          expect(res.body.data.message).to
            .equal('Sms not found');
          done();
        });
    });

    it('it should fail if contactId does not exist', (done) => {
      superRequest.delete(`/api/sms?contactId=99999&smsId=${testSms2.id}`)
        .set({ 'content-type': 'application/json' })
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
