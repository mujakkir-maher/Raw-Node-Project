/*
     title: Utilities, important utilities function..
*/

// moduling scaffolding
const crypto = require('crypto');
const utilities = {};
const environments = require('./environments');
const { env } = require('process');

// parse JSON string to object
utilities.parseJSON = (jsonString) => {
    let output;
    
    try {
        output = JSON.parse(jsonString);
    } catch {
        output = {};
    }

    return output;
}

// string hashing
utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0){
        const hash  = crypto
        .createHmac("sha256", environments.secretKey)
        .update(str)
        .digest("hex");
    return hash;
    }
    return false;
};

// create random string
utilities.createRandomString = (strlength) => {
   let length = strlength;
   length = typeof(strlength) === 'number' && strlength > 0 ? strlength : false;

   if(length){
        const possiblecharacters = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for(let i = 1; i <= length; i++){
            const randomCharacter = possiblecharacters.charAt(Math.floor(Math.random() * possiblecharacters.length));
            output += randomCharacter;
        }
        return output;    
   } 
   return false;
};

// export module
module.exports = utilities;