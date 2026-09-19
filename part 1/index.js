/*
 * Title: Uptime monitoring application
 * Descrip: A RESTFul API to monitor up or down time of user difened links
 * tutor: Sumit Saha
 */


// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data')

// app object - module scaffolding
const app = {};

// testing file system 
// @ToDo pore muche fela hobe


// testing write...
// data.create('test', 'newFile', {name: 'Bangladesh', language: 'Bangla'}, (err) => {
//     console.log('error was', err);
// })



// testing read...
data.read('test', 'newFile', (err, data) => {
    console.log(err, data);
});



// testing update...
// data.update('test', 'newFile', {name: 'England', language: 'English'}, (err) => {
//     console.log(err);
// })




// testing delete...
// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// })


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    // srever start korte hole server ke ekta port e listen korte hoy
    server.listen(environment.port, () => {
        console.log(`listening to port ${environment.port}`);
    });
};

// handle request and response
app.handleReqRes = handleReqRes;

 
// start the server
app.createServer();