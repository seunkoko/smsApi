const validateHeader = (req, res) => {
  const header = 'content-type' in req.headers ? req.headers['content-type'].toLowerCase() : null
  if (header !== 'application/json') {
    return res.status(400)
      .send({
        status: 'fail',
        data: {
          message: 'Request Header not set',
        }
      });
  }
}

module.exports = {
  validateUpdateContactInput: (req, res) => {
    const phoneNumberTest = 'phoneNumber' in req.body ? /^[+]?[0-9^ ]+$/.test(req.body.phoneNumber) : true;
    if (!phoneNumberTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Invalid Phone Number'
          }
        });
    }
    req.contactInput = {
      name: 'name' in req.body ? req.body.name.toString() : null,
      phoneNumber: 'phoneNumber' in req.body ? req.body.phoneNumber : null,
    };
    return req.contactInput;
  },
  validateContactInput: (req, res) => {
    validateHeader(req, res);
    const phoneNumberTest = /^[+]?[0-9^ ]+$/.test(req.body.phoneNumber);
    if (!req.body.name) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Name (name) field is required'
          }
        });
    }
    if (!req.body.phoneNumber) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Phone number (phoneNumber) field is required'
          }
        });
    }
    if (!phoneNumberTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Invalid Phone Number'
          }
        });
    }
    req.contactInput = {
      name: req.body.name.toString(),
      phoneNumber: req.body.phoneNumber,
    };
    return req.contactInput;
  },
  validateSmsInput: (req, res, next) => {
    validateHeader(req, res);
    const recipientNumberTest = /^[+]?[0-9^ ]+$/.test(req.body.recipientNumber);
    if (!req.body.message) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Message (message) field is required'
          }
        });
    }
    if (!req.body.recipientNumber) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Recipient number (recipientNumber) field is required'
          }
        });
    }
    if (!recipientNumberTest) {
      return res.status(400)
        .send({
          status: 'error',
          data: {
            message: 'Invalid Recipient Phone Number'
          }
        });
    }
    req.smsInput = {
      message: req.body.message.toString(),
      recipientNumber: req.body.recipientNumber,
      smsStatus: 'pending',
    };
    return req.smsInput
  },
};
