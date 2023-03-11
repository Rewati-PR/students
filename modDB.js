let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "rewati14",
    database : "studentsDB",
};

function getConnection(){
    return  mysql.createConnection(connData);
}

module.exports.getConnection= getConnection;