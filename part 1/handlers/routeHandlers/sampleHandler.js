/*
    *title : sample handler 
*/

// module scaffolding 
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);
    callback(200, {
        massage : 'this is a sample url',
    });
};

module.exports = handler;