/*
    *title : tokenHandler handler : handler to handle token related routes
    tokaen based authentication...
*/
// dependencies
const data = require('../../lib/data');
const {hash} = require('../../helpers/utilities');
const {createRandomString} = require('../../helpers/utilities');
const {parseJSON} = require('../../helpers/utilities');

// module scaffolding 
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
   const acceptedMethods = ['get', 'post', 'put', 'delete'];
   if(acceptedMethods.indexOf(requestProperties.method) > -1){
        handler._token[requestProperties.method](requestProperties, callback);
   } else {
    callback(405);
   }
};

handler._token = {};

handler._token.post = (requestProperties, callback) => {
   // create token.
   // user je phn ar password pathabe seta valid kina check korte hobe
    const phone = typeof(requestProperties.body.phone) === 'string'
        && requestProperties.body.phone.trim().length === 11 ?
        requestProperties.body.phone : false;

    const password = typeof(requestProperties.body.password) === 'string'
        && requestProperties.body.password.trim().length > 0 ?
        requestProperties.body.password : false;

    if(phone && password){
        // phn ar password jehetu valid, ekhn amake database e check korte hobe je related data DB te ase kina 
        data.read('users', phone, (err1, userData) => {
            let hashedpassword = hash(password);
            if(hashedpassword === parseJSON(userData).password){
                let tokenID = createRandomString(20);
                let expires = Date.now() + 60*60*1000;
                let tokenObject = {
                    'phone' : phone,
                    'id' : tokenID,
                    'expires' : expires
                }

                // store the token in DB
                data.create('tokens', tokenID, tokenObject, (err2) => {
                    if(!err2){
                        callback(200, tokenObject);
                    } else {
                        callback(500, {
                            error : 'There was a problem in the server side!',
                        });
                    }
                });
            } else {
                callback(400, {
                    error: "Password is not valid",
                });
            }
        });
    } else {
        callback(400, {
            error: "You have a problem in your request",
        });
    }
};

handler._token.get = (requestProperties, callback) => {
     const id = typeof(requestProperties.queryStringObject.id) === 'string'
         && requestProperties.queryStringObject.id.trim().length === 20 ?
         requestProperties.queryStringObject.id : false;
    
         if(id){
            data.read('tokens', id, (err, tokenData) => {
                const token = {...parseJSON(tokenData)};
                if(!err && token){
                    callback(200, token);
                } else {
                    callback(404, {
                        error : 'Requested token was not found!'
                    });
                }
            });
         } else {
            callback(404, {
                error : 'Requested token was not found!'
            });
         }
};

handler._token.put = (requestProperties, callback) => {
    const id = typeof(requestProperties.queryStringObject.id) === 'string'
         && requestProperties.queryStringObject.id.trim().length === 20 ?
         requestProperties.queryStringObject.id : false;

    const extend = typeof requestProperties.body.extend === 'boolean' 
        && requestProperties.body.extend === true ? true : false;

        if(id && extend){
            data.read('tokens', id, (err1, tokenData) => {
                let tokenObject = parseJSON(tokenData);
                if(tokenObject.expires > Date.now()) {
                    tokenObject.expires = Date.now() + 60 * 60 * 1000;
                    // store the updated token 
                    data.update('tokens', id, tokenObject, (err2) => {
                        if(!err2) {
                            callback(200);
                        } else {
                            callback(500, {
                                error : 'There was a server side error!',
                            });
                        }
                    });
                } else {
                    callback(400, { 
                        error: 'Token already expired!',
                    });
                }
            });
        } else {
            callback(400, {
                error: 'THere was a problem in yout request!',
            });
        }
};

handler._token.delete = (requestProperties, callback) => {
    const id = typeof(requestProperties.body.id) === 'string'
            && requestProperties.body.id.trim().length === 20 ?
            requestProperties.body.id : false;
    
            if(id){
                data.read('tokens', id, (err1, tokenData) => {
                    if(!err1 && tokenData){
                        data.delete('tokens', id, (err2) => {
                            if(!err2) {
                                callback(200, {
                                    message: "Token was deleted successfully!",
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
