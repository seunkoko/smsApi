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
  delete(req, res) {
    if (isNaN(parseInt(req.query.contactId))) {
      return res.status(400).send({
        status: 'fail',
        data: {
          message: 'Parameter contactId not valid'
        }
      }); 
    }

    if (isNaN(parseInt(req.query.smsId))) {
      return res.status(400).send({
        status: 'fail',
        data: {
          message: 'Parameter smsId not valid'
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
            message: 'Contact not found',
          }
        });
      }

      return Sms
      .findById(parseInt(req.query.smsId))
      .then(sms => {
        if (!sms) {
          return res.status(404).send({
            status: 'fail',
            data: {
              message: 'Sms not found',
            }
          });
        }

        if (sms.dataValues.senderId !== contact.dataValues.id) {
          return res.status(401).send({
            status: 'fail',
            data: {
              message: 'You are not authorized to delete this message',
            }
          });
        }

        return sms
        .destroy()
        .then(() => res.status(200).send({
          status: 'success',
          data: {
            message: 'Sms succesfully deleted',
            sms: {},
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
      }))  
    })
    .catch(error => res.status(400).send({
      status: 'fail',
      data: {
        error
      }
    }))  
  },
  getAll(req, res) {
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
            message: 'Contact not found',
          }
        });
      }

      return Sms
      .findAll({
        where: {
          $or: {
            senderId: parseInt(req.query.contactId),
            receiverId: parseInt(req.query.contactId),
          }
        },
      })
      .then((sms) => res.status(200).send({
        status: 'success',
        data: {
          message: 'Sms successfully retrieved',
          sms,
        }
      }))
      .catch(error => res.status(400).send({
        status: 'fail',
        data: { error }
      }));
    })
    .catch(error => res.status(400).send({
      status: 'fail',
      data: { error }
    }));
  },
};
