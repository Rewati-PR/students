let mysql = require("mysql");
let connData = {
  host: "localhost",
  user: "root",
  password: "rewati14",
  database: "testDB",
};

function showPersons() {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM persons";
  connection.query(sql, function (err, result) {
    if (err) {
      console.log(err);
    } else console.log(result);
  });
}

function showPersonsByName(name) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM persons WHERE name=?";
  connection.query(sql, name, function (err, result) {
    if (err) {
      console.log(err);
    } else console.log(result);
  });
}

function insertPerson(params) {
  let connection = mysql.createConnection(connData);
  let sql = "INSERT INTO persons(name,age) VALUES(?,?)";
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Id of inserted record : ", result.insertId);
      let sql2 = "SELECT * FROM persons";
      connection.query(sql2, function (err, result) {
        if (err) {
          console.log(err);
        } else console.log(result);
      });
    }
  });
}

function insertPersons(params) {
  let connection = mysql.createConnection(connData);
  let sql = "INSERT INTO persons(name,age) VALUES ?";
  connection.query(sql, [params], function (err, result) {
    if (err) console.log(err);
    else {
      let sql2 = "SELECT * FROM persons";
      connection.query(sql2, function (err, result) {
        if (err) {
          console.log(err);
        } else console.log(result);
      });
    }
  });
}

function incrementAge(id){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE persons SET age=35 WHERE id=?";
    connection.query(sql, id, function (err, result) {
      if (err) console.log(err);
      else {
        let sql2 = "SELECT * FROM persons";
        connection.query(sql2, function (err, result) {
          if (err) {
            console.log(err);
          } else console.log(result);
        });
      }
    });  
}

function changeAge(id,newAge){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE persons SET age=? WHERE id=?";
    connection.query(sql,[newAge,id], function (err, result) {
      if (err) {
        console.log(err);
      } else console.log(result);
    });
  
}
 function resetData(){
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM persons";
    connection.query(sql1, function (err, result) {
      if (err) {
        console.log(err);
      } else{
         console.log("Successfully deleted. Affected rows : ",result.affectedRows);
         let {persons} = require("./testData.js");
         let arr = persons.map((p)=>[p.name,p.age]);
         let sql2 = "INSERT INTO persons(name,age) VALUES ?";
         connection.query(sql2,[arr], function (err, result) {
            if (err) {
              console.log(err);
            } else console.log("Successfully Inserted. Affected rows : ",result.affectedRows);
          });
    };
    });  
 }

resetData();
//changeAge(3, 33);
//insertPerson(["Albert",42]);
//showPersons();
//showPersonsByName("Bob");
/*insertPersons([
  ["Jim", 30],
  ["Amy", 34],
  ["Steven", 24],
]);*/
//incrementAge(7);
