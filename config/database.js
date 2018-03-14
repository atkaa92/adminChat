const mysql = require('mysql');

host =  "localhost";
user =  "root";
password =  "";
database =  'l1tvin';

module.exports = {
    con: mysql.createConnection({
        host: host,
        user: user,
        password: password,
        database: database
    }),
    database : database
}