/*
    *title : checkHandler handler : handler to handle user defined checks
*/
// dependencies
const data = require('../../lib/data');
const {parseJSON, createRandomString} = require('../../helpers/utilities');
const tokenHandler = require('./tokenHandler');
const {maxChecks} = require('../../helpers/environments');

// module scaffolding 
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
   const acceptedMethods = ['get', 'post', 'put', 'delete'];
   if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._check[requestProperties.method](requestProperties, callback);
   } else {
    callback(405);
   }
};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // validate inputs...
    let protocol = typeof(requestProperties.body.protocol) === 'string' 
    && ['http', 'https'].indexOf (requestProperties.body.protocol) > -1 
    ? requestProperties.body.protocol : false;

    let url = typeof(requestProperties.body.url) === 'string' 
    && requestProperties.body.url.trim().length > 0
    ? requestProperties.body.url : false;

    let method =  typeof(requestProperties.body.method) === 'string' 
    && ['GET', 'POST', 'PUT', 'DELETE'].indexOf (requestProperties.body.method) > -1 
    ? requestProperties.body.method : false;

    let successCodes = typeof(requestProperties.body.successCodes) === 'object' 
    && requestProperties.body.successCodes instanceof Array 
    ? requestProperties.body.successCodes : false;

    let timeoutSecond = typeof(requestProperties.body.timeoutSecond) === 'number' 
    && requestProperties.body.timeoutSecond % 1 === 0
    && requestProperties.body.timeoutSecond >= 1
    && requestProperties.body.timeoutSecond <= 5
    ? requestProperties.body.timeoutSecond : false;

    if(protocol && url && method && successCodes && timeoutSecond){
        const token = 
            typeof(requestProperties.headerObject.token) === 'string'
            ? requestProperties.headerObject.token : false;

         // lookup the user phone by reading the token
         data.read('tokens', token, (err1, tokenData) => {
            if(!err1 && tokenData){
                let userPhone = parseJSON(tokenData).phone;
                // lookup the user data
                data.read('users', userPhone, (err2, userData) => {
                    if(!err2 && userData){
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if(tokenIsValid){
                                let userObject = parseJSON(userData);
                                
                                let userChecks = typeof(userObject.checks) === 'object' 
                                && userObject.checks instanceof Array
                                ? userObject.checks : [];

                                if(userChecks.length < maxChecks){
                                    let checkId = createRandomString(20);
                                    const checkObject = {
                                        id : checkId,
                                        userPhone,
                                        protocol,
                                        url,
                                        method,
                                        successCodes,
                                        timeoutSecond,
                                    };
                                    // save the obj
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if(!err3){
                                            // add check id to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('users', userPhone, userObject, (err4) => {
                                                if(!err4){
                                                    // return the data about the new check
                                                    callback(200, checkObject);
                                                } else {
                                                    callback(500, {
                                                        error : 'There was a problem in the server side'
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, {
                                                error : 'There was a problem in the server side!'
                                            });
                                        }
                                    });
                                } else {
                                    callback(401, {
                                        error : 'User has already reached max check limit!'
                                    });
                                }

                            } else {
                                callback(403, {
                                    error : 'Authentication problem!',
                                });
                            }
                        });
                    } else {
                        callback(403, {
                            error : 'User not found!',
                        });
                    }
                });
            } else {
                callback(403, {
                    error : 'Authentication problem!',
                });
            }
         });

    } else {
        callback(400, {
            reeor : 'You have a problem in your request!',
        });
    }
};


handler._check.get = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string'
            && requestProperties.queryStringObject.id.trim().length === 20 ?
            requestProperties.queryStringObject.id : false;

        

};


handler._check.put = (requestProperties, callback) => {
   
};


handler._check.delete = (requestProperties, callback) => {
   
};

module.exports = handler;
