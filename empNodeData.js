let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "rewati14",
    database : "empDB",
};

function getConnection(){
    return  mysql.createConnection(connData);
}

module.exports.getConnection= getConnection;