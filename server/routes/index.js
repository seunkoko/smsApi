const contactController = require('../controllers').contact;

const routes = {
  'api': 'GET /api - root url to display all routes for the SMS api',
  'create contact': 'POST /api/contact - body [name, phoneNumber]',
  'get single contact': 'GET /api/contact - params [contactId]',
  'update single contact': 'PUT /api/contact - params [contactId], body [name, phoneNumber]',
  'delete contact': 'DELETE /api/contact - params [contactId]',
  'get all contacts': 'GET /api/contacts',
  'create sms': 'POST /api/sms - params [contactId], body [message, recipientNumber]',
  'delete sms': 'DELETE /api/sms - params [contactId, smsId]',
  'get all sms': 'GET /api/sms_messages - params [contactId]',
}

module.exports = (app) => {
  app.get('/api', (req, res) => res.status(200).send({
    message: 'Welcome to the SMS API!',
    routes,
  }));

  app
    .route('/api/contact')
    .post(contactController.create)
    .get(contactController.getOne)
    .put(contactController.update)

  app
    .route('/api/contacts')
    .get(contactController.getAll)
};
