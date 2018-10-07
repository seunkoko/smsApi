import {
  validateSmsInput,
} from '../middlewares/validation';

const Sms = require('../models').Sms;
const Contact = require('../models').Contact;

module.exports = {
  create(req, res) {
    const smsInput = validateSmsInput(req, res);
    if (isNaN(parseInt(req.query.contactId))) {
      return res.status(400).send({
        status: 'fail',
        data: {
          message: 'Parameter contactId not valid'
        }
      }); 
    }
  
    return Contact
    .findById(parseInt(req.query.contactId))
    .then(contact => {
      if (!contact) {
        return res.status(404).send({
          status: 'fail',
          data: {
            message: 'Sender contact not found',
          }
        });
      }

      return Contact
      .find({ where: { phoneNumber: smsInput.recipientNumber } })
      .then(recipientContact => {
        if (!recipientContact) {
          return res.status(404).send({
            status: 'fail',
            data: {
              message: 'Recipient contact not found',
            }
          });
        }

        return Sms
        .create({
          senderId: contact.dataValues.id,
          receiverId: recipientContact.dataValues.id,
          message: smsInput.message,
          smsStatus: 'delivered',
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .then(sms => res.status(201).send({
          status: 'success',
          data: {
            message: 'Sms successfully created',
            sms,
          }
        }))
        .catch(error => res.status(400).send({
          status: 'fail',
          data: {
            error
          }
        }));
      })
      .catch(error => res.status(400).send({
        status: 'fail',
        data: {
          error
        }
      }));
    })
    .catch(error => res.status(400).send({
      status: 'fail',
      data: {
        error
      }
    }))
  },
};
