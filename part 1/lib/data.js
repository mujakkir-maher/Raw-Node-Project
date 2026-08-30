const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, `wx`, (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            // write data to file and then close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false);
                        } else {
                            callback('error closing the new file');
                        }
                    });
                } else {
                    callback('error waiting to the new file')
                }
            });
        } else {
            callback('could not create new file, it may already exists');
        }
    });
};

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf-8', (err, data) => {
        callback(err, data);
    });
};

// update existing file
lib.update = (dir, file, data, callback) => {
    // agey file ta open korte hobe
    fs.open(`${lib.basedir + dir}/${file}.json`, `r+`, (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // jodi error na hoy taile amake data ke string e convert korte hobe
            const stringData = JSON.stringify(data);

            // ekhn file ta ke khali korte hobe 
            fs.ftruncate(fileDescriptor, (err1) => {
                // khali korte parle error dibe na. na parle error dibe
                if(!err1) {
                    // kunu error nai mane khali kora ses. ekhn write kora jabe
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if(!err2) {
                            // file ke close korte hobe.
                            fs.close(fileDescriptor, (err3) => {
                                if(!err3) {
                                    callback(false);
                                } else {
                                    callback(`error closing file`);
                                }
                            });
                        } else {
                            callback('error writing to file')
                        }
                    });
                } else {
                    console.log('Error Truncating file')
                }
            });
        } else {
            callback(`error updateing. File may not exist`);
        }
    });
}

// delete existing file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if(!err) {
            callback(false);
        } else {
            callback(`Error to deleting file...`)
        }
    });
};
module.exports = lib;