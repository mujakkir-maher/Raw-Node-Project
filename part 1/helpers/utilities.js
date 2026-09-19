/*
     title: Utilities, important utilities function..
*/

// moduling scaffolding
const crypto = require('crypto');
const utilities = {};
const environments = require('./environments')

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
        .createHmac("sha256", )
        .update(str)
        .digest("hex");
    }
};

// export module
module.exports = utilities;