var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
const port = 2410;
app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let {getConnection} = require("./empNodeData.js");


app.get("/svr/employees",function (req,res){
    let connection = getConnection();
    let sql = "SELECT * FROM employees";
    connection.query(sql,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else res.send(result);
    });
});

app.get("/svr/employees/:id",function (req,res){
  let id = req.params.id;
  let connection = getConnection();
  let sql = "SELECT * FROM employees WHERE id=?";
  connection.query(sql,id,function(err,result){
  if(err){
     console.log(err);
     res.status(404).send("Error in fetching data");
  }
  else res.send(result);
  });
});
app.post("/svr/employees",function(req,res){
  let body = req.body;
  let connection = getConnection();
  let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) values (?,?,?,?,?,?)";
  connection.query(sql,[body.empCode,body.name,body.department,body.designation,body.salary,body.gender],function(err,result){
  if(err){
     console.log(err);
     res.status(404).send("Error in inserting data");
  }
  else res.send(`Post success. Id of new mobile is ${result.insertId}`);
 });
});
app.put("/svr/employees/:id",function(req,res){
  let id = req.params.id;
  let body = req.body;
  let connection = getConnection();
  let sql = "UPDATE employees SET empCode=?, name=?, department=?, designation=?, salary=?, gender=? WHERE id=?";
  let params = [body.empCode,body.name,body.department,body.designation,body.salary,body.gender,id];
  connection.query(sql,params,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in updating data");
    }
    else if(result.affectedRows===0) res.status(404).send("No update happened");
    else res.send("Update success");
  });
});

app.delete("/svr/employees/:id",function(req,res){
  let id = req.params.id;
  let connection = getConnection();
  let sql = "DELETE FROM employees WHERE id=?";
  connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in deleting data");
    }
    else if(result.affectedRows===0) res.status(404).send("No delete happened");
    else res.send("Delete success");
  });
});


/*app.get("/svr/resetData",function(req,res){
    let connection = getConnection();
    let sql1 = "TRUNCATE TABLE employees";
        connection.query(sql1,function(err,result){
          if(err){
             console.log(err);
             res.status(404).send("Error in deleting data");
          }
          else{
            console.log(`Deletion success.Deleted ${result.affectedRows} rows`);
        
        let {empsData} = require("./EmployeeData.js");
        let arr = empsData.map((e) => [e.empCode,e.name,e.department,e.designation,e.salary,e.gender]);
        let sql = "INSERT INTO employees(empCode,name,department,designation,salary,gender) VALUES ?";
        connection.query(sql,[arr],function(err,result){
          if(err){
             console.log(err);
             res.status(404).send("Error in inserting data");
          }
          else res.send(`Reset success. Inserted ${result.affectedRows} rows`);
        });
          } 
        });
    
});
*/