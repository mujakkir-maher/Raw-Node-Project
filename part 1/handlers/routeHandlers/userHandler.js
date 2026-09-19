/*
    *title : userHandler handler : handler to handle user related routes
*/
// dependencies
const data = require('../../lib/data')

// module scaffolding 
const handler = {};

handler.userHandler = (requestProperties, callback) => {
   const acceptedMethods = ['get', 'post', 'put', 'delete'];
   if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._user[requestProperties.method](requestProperties, callback);
   } else {
    callback(405);
   }
};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const firstName = typeof(requestProperties.body.firstName) === 'string'
    && requestProperties.body.firstName.trim().length > 0 ?
    requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string'
    && requestProperties.body.lastName.trim().length > 0 ?
    requestProperties.body.lastName : false;

    const phone = typeof(requestProperties.body.phone) === 'string'
    && requestProperties.body.phone.trim().length === 11 ?
    requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string'
    && requestProperties.body.password.trim().length > 0 ?
    requestProperties.body.password : false;

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'string'
    && requestProperties.body.tosAgreement.trim().length > 0 ?
    requestProperties.body.tosAgreement : false;

    if(firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err, user) => {
            if(err){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                }
            } else {
                callback(500, {
                    'error': 'There was a problem in server side!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

handler._user.get = (requestProperties, callback) => {
    callback(200);
};

handler._user.put = (requestProperties, callback) => {

};

handler._user.delete = (requestProperties, callback) => {

};

module.exports = handler;