let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password : "rewati14",
    database : "mobileDB",
};

function getConnection(){
    return  mysql.createConnection(connData);
}

module.exports.getConnection= getConnection;