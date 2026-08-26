/*
 * Title: Uptime monitoring application
 * Descrip: A RESTFul API to monitor up or down time of user difened links
 * tutor: Sumit Saha
 */


// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');

// app object - module scaffolding
const app = {};

// configuration 
app.config = {
    port: 3000
};

// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    // srever start korte hole server ke ekta port e listen korte hoy
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`);
    });
};

// handle request and response
app.handleReqRes = handleReqRes;

 
// start the server
app.createServer();