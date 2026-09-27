/*
 * title : Routes: application Routes 
*/

// dependencies
const {sampleHandler} = require('./handlers/routeHandlers/sampleHandler');
const {userHandler} = require('./handlers/routeHandlers/userHandler');
const {tokenHandler} = require('./handlers/routeHandlers/tokenHandler');

// Routs object er majhe sob route save kora thakbe. ekhn jei url e hit korbe sei function ta execute hobe
const routes = {
    sample : sampleHandler,
    user: userHandler,
    token : tokenHandler
};

module.exports = routes;