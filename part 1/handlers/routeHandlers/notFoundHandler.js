/*
    *title : 404 NotFound handler 
*/

// module scaffolding 
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'your url was not found',
    });
};

module.exports = handler;