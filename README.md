# SMS API
SMS management API

> Note: For learning purposes, you can follow the commit history of this repo.

To use the routes, visit [SMS API](https://)

### Features
---

* Users can create a contact.
* Users can get a contact.
* Users can get all contacts.
* Users can edit a contact.
* Users can delete a contact.
* Users can create (send) sms.
* Users can delete sms.
* Users can get all sms received and sent.

**Authorization**:
No authorization required

### Endpoints
---

This is the [link](https://banking-app-api.herokuapp.com) in which to access the api. 

Below are the collection of routes.


#### Contact

EndPoint          |   Functionality    |    Request body/params
------------------|--------------------|--------------------------------------------------------------
POST /api/contact  | Create a contact   | body [name, phoneNumber]
GET /api/contact   | Gets a single contact | params [contactId]    
PUT /api/contact   | Updates a contact  | params [contactId], body [*name, *phoneNumber]
DELETE /api/contact | Deletes a contact | params [contactId]
GET /api/contacts  | Gets all contacts |  

#### Sms

EndPoint          |   Functionality    |    Request body/params
------------------|--------------------|--------------------------------------------------------------
POST /api/sms     | Create sms         | params [contactId], body [message, recipientNumber]
DELETE /api/sms   | Deletes sms        | params [contactId, smsId]      
GET /api/sms_messages  | Gets all sms  | params [contactId]

### Technologies Used
---

- Node.js
- Express
- Sequelize


### Installation
---

- Clone the project repository.
- Run the command below to clone:
> git clone https://github.com/seunkoko/smsApi.git.
- Change directory into the smsApi directory.
- Install all necessary packages in the package.json file. Depending on if you are using `npm`, you can use the command below:
> npm install
- Run the command below to start the application locally:
> npm run start:dev


#### Contributing
---

1. Fork this repository to your account.
2. Clone your repository: git clone https://github.com/seunkoko/smsApi.git.
4. Commit your changes: git commit -m "did something".
5. Push to the remote branch: git push origin new-feature.
6. Open a pull request.

#### Licence
---

ISC

Copyright (c) 2018 Oluwaseun Owonikoko
