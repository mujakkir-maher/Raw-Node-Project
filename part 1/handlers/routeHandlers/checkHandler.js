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

       if(id){
            // lookup the check
            data.read('checks', id, (err, checkData) => {
                if(!err && checkData){
                     const token = 
                     typeof(requestProperties.headerObject.token) === 'string'
                     ? requestProperties.headerObject.token : false;

                     tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                        if(tokenIsValid){
                            callback(200, parseJSON(checkData));
                        } else {
                            callback(403, {
                                error : "Authentication failure!",
                            });
                        }
                     });
                } else {
                    callback(500, {
                        error : 'You have a problem in your request!',
                    });
                }
            });
       } else {
        callback(400, {
            error : 'You have a problem in your requst!',
        });
       } 
};


handler._check.put = (requestProperties, callback) => {
    let id = typeof(requestProperties.body.id) === 'string' 
        && requestProperties.body.id.trim().length === 20 
        ? requestProperties.body.id : false;

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

    if(id) {
        if(protocol || url || method || successCodes || timeoutSecond) {
            data.read('checks', id, (err1, checkData) => {
                if(!err1 && checkData){
                    const checkObject = parseJSON(checkData);
                    const token = 
                        typeof requestProperties.headerObject.token === 'string'
                        ? requestProperties.headerObject.token
                        : false;

                   tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if(tokenIsValid){
                            if(protocol){
                                checkObject.protocol = protocol;
                            }
                            if(url){
                                checkObject.url = url;
                            }
                            if(method){
                                checkObject.method = method;
                            }
                            if(successCodes){
                                checkObject.successCodes = successCodes;
                            }
                            if(timeoutSecond){
                                checkObject.timeoutSecond = timeoutSecond;
                            }

                            // store the updated check object
                            data.update('checks', id, checkObject, (err2) => {
                                if(!err2) {
                                    callback(200);
                                } else {
                                    callback(500, {
                                        error : 'There was a server side error!',
                                    });
                                }
                            });
                        } else {
                            callback(403, {
                                error : 'Authentication error!',
                            });
                        }
                   }); 
                } else {
                    callback(500, {
                        error : 'There was a problem in the server side!',
                    });
                }
            });
        } else {
            callback(400, {
                error : 'You must provide at least one field to update!',
            });
        }
    } else {
        callback(400, {
            error : 'You have a problem in your request',
        });
    }
};


handler._check.delete = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string'
        && requestProperties.queryStringObject.id.trim().length === 20
        ? requestProperties.queryStringObject.id : false;

    if(id) {
        data.read('checks', id, (err1, checkData) => {
            if(!err1 && checkData) {
                const checkObject = parseJSON(checkData);
                const token = 
                    typeof requestProperties.headerObject.token === 'string'
                    ? requestProperties.headerObject.token
                    : false;

                tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                    if(tokenIsValid) {
                        // delete the check data
                        data.delete('checks', id, (err2) => {
                            if(!err2) {
                                // remove check id from user object
                                data.read('users', checkObject.userPhone, (err3, userData) => {
                                    if(!err3 && userData) {
                                        let userObject = parseJSON(userData);
                                        let userChecks = typeof(userObject.checks) === 'object'
                                            && userObject.checks instanceof Array
                                            ? userObject.checks : [];

                                        const checkIndex = userChecks.indexOf(id);
                                        if(checkIndex > -1) {
                                            userChecks.splice(checkIndex, 1);
                                            userObject.checks = userChecks;
                                            data.update('users', checkObject.userPhone, userObject, (err4) => {
                                                if(!err4) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        error : 'There was a server side error!',
                                                    });
                                                }
                                            });
                                        } else {
                                            callback(500, { error : 'Check not found in user object!' });
                                        }
                                    } else {
                                        callback(500, { error : 'There was a server side error!' });
                                    }
                                });
                            } else {
                                callback(500, { error : 'Could not delete the check data!' });
                            }
                        });
                    } else {
                        callback(403, {
                            error : 'Authentication error!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error : 'Check ID not found!',
                });
            }
        });
    } else {
        callback(400, {
            error : 'You have a problem in your request!',
        });
    }
};

module.exports = handler;
