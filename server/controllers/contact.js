import {
  validateContactInput,
  validateUpdateContactInput,
} from '../middlewares/validation';

const Contact = require('../models').Contact;

module.exports = {
  create(req, res) {
    const contactInput = validateContactInput(req, res);
    return Contact
      .create({
        name: contactInput.name,
        phoneNumber: contactInput.phoneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .then(contact => res.status(201).send({
        status: 'success',
        data: {
          message: 'Contact successfully created',
          contact,
        }
      }))
      .catch(error => res.status(400).send({
        status: 'fail',
        data: {
          message: error.errors[0].message,
          type: error.errors[0].type,
        }
      }));
  },
  getOne(req, res) {
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
      return res.status(200).send({
        status: 'success',
        data: {
          message: 'Contact successfully retrieved',
          contact,
        }
      });
    })
    .catch(error => res.status(400).send({
      status: 'fail',
      data: {
        message: error.errors[0].message,
        type: error.errors[0].type,
      }
    }));
  },
};
