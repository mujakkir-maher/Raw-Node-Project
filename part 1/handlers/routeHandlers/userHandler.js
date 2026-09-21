/*
    *title : userHandler handler : handler to handle user related routes
*/
// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

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

    const tosAgreement = typeof(requestProperties.body.tosAgreement) === 'boolean'
    && requestProperties.body.tosAgreement === true ?
    requestProperties.body.tosAgreement : false;

    if(firstName && lastName && phone && password && tosAgreement) {
        data.read('users', phone, (err1, user) => {
            if(err1){
                let userObject = {
                    firstName,
                    lastName,
                    phone,
                    password : password,
                    tosAgreement,
                };
                // store the user to db
                data.create('users', phone, userObject, (err2) => {
                    if(!err2){
                        callback(200, {
                            message : 'User was created successfully!'
                        })
                    } else {
                        callback(500, {error : 'Could not create user!'});
                    }
                });
            } else {
                callback(409, {
                    error: 'A user with this phone number already exists!',
                });
            }
        });
    } else {
        callback(400, {
            error: 'You have a problem in your request',
        });
    }
};

//@todo: Authentication baki
handler._user.get = (requestProperties, callback) => {
    // first e check korte hobe phone number valid kina. karon ekhane phn number tai unique
     const phone = typeof(requestProperties.queryStringObject.phone) === 'string'
     && requestProperties.queryStringObject.phone.trim().length === 11 ?
     requestProperties.queryStringObject.phone : false;

     if(phone){
        // ekhn kaj hoilo oi user ke khuje ber kora 
        data.read('users', phone, (err, u) => {
            const user = {...parseJSON(u)};
            if(!err && user){
                delete user.password;
                callback(200, user);
            } else {
                callback(404, {
                    error : 'Requested user was not found!'
                });
            }
        });
     } else {
        callback(404, {
            error : 'Requested user was not found!'
        });
     }
};
//@todo: Authentication baki
handler._user.put = (requestProperties, callback) => {

    const phone = typeof(requestProperties.body.phone) === 'string'
        && requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

    const firstName = typeof(requestProperties.body.firstName) === 'string'
        && requestProperties.body.firstName.trim().length > 0 ?
        requestProperties.body.firstName : false;

    const lastName = typeof(requestProperties.body.lastName) === 'string'
        && requestProperties.body.lastName.trim().length > 0 ?
        requestProperties.body.lastName : false;

    const password = typeof(requestProperties.body.password) === 'string'
        && requestProperties.body.password.trim().length > 0 ?
        requestProperties.body.password : false;

        if(phone){
            if(firstName || lastName || password) {
                // ekhane check korte hobe je number diya search kora hocche seti DB te ache kina
                data.read('users', phone, (err1, uData) => {
                    const userData = {...parseJSON(uData)};
                    if(!err1 && userData){
                        if(firstName){
                            userData.firstName = firstName;
                        }
                        if(lastName){
                            userData.lastName = lastName;
                        }
                        if(password){
                            userData.password = hash(password);
                        }

                        // store to DB
                        data.update('users', phone, userData, (err2) => {
                            if(!err2){
                                callback(200, {
                                    message: 'user was updated successfully!'
                                });
                            } else {
                                callback(500, {
                                    error: 'There was a problem in the server side!'
                                });
                            }
                        });
                    } else {
                        callback(400, {
                            error: 'You have a problem in your request!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: 'You have a problem in your request!',
                });
            }
        } else {
            callback(400, {
                error: 'Invalid phone number. Please ty again!',
            });
        }
};
//@todo: Authentication baki
handler._user.delete = (requestProperties, callback) => {
    const phone = typeof(requestProperties.body.phone) === 'string'
        && requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

        if(phone){
            data.read('users', phone, (err1, userData) => {
                if(!err1 && userData){
                    data.delete('users', phone, (err2) => {
                        if(!err2) {
                            callback(200, {
                                message: "User was deleted successfully!",
                            });
                        } else {
                            callback(500, {
                                error: "There was a server side error!",
                            });
                        }
                    });
                } else {
                    callback(500, {
                        error: "There was a server side error!",
                    });
                }
            });
        } else {
            callback(400, {
                error: "There was a problem in your request!",
            });
        }
};

module.exports = handler;