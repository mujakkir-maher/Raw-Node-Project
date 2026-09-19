/*
 * title : Routes: application Routes 
*/

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');

// Routs object er majhe sob route save kora thakbe. ekhn jei url e hit korbe sei function ta execute hobe
const routes = {
    sample : sampleHandler,
    user: userHandler
};

module.exports = routes;