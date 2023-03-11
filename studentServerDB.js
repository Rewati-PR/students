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

let {getConnection} = require("./modDB.js");

app.get("/svr/students",function (req,res){
  let course = req.query.course;
  let grade = req.query.grade;
  let sort = req.query.sort;
 let connection = getConnection();
 let options = "";
 let optionsArr = [];
 if (course)  {
  let courseArr = course.split(",");
  options = " Where course IN (?) ";
  optionsArr.push(courseArr);
}
if(grade){
  options = options ? `${options} AND grade=?` : " Where grade=? ";
  optionsArr.push(grade);
}
if(sort){
  options =  `${options} ORDER BY ${sort}`;
}
 let sql = `SELECT * FROM students ${options}`;
 connection.query(sql,optionsArr,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else res.send(result);
 });
});

app.get("/svr/students/:id",function(req,res){
 let id = +req.params.id;
 let connection = getConnection();
 let sql = "SELECT * FROM students WHERE id=?";
 connection.query(sql,id,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else if(result.length===0)
  res.status(404).send("No student found");
 else res.send(result[0]);
});
});

app.get("/svr/students/course/:name",function(req,res){
  let name = req.params.name;
  let connection = getConnection();
  let sql = "SELECT * FROM students WHERE course=?";
  connection.query(sql,name,function(err,result){
  if(err){
     console.log(err);
     res.status(404).send("Error in fetching data");
  }
  else res.send(result);
 });
 });

 app.post("/svr/students",function(req,res){
  let body = req.body;
  let connection = getConnection();
  let sql1 = "SELECT * FROM students WHERE name=?";
  connection.query(sql1,body.name,function(err,result){
    if(err){
      console.log(err);
      res.status(404).send("Error in inserting data");
   }
   else if(result.length>0)  res.status(404).send(`Name already exists : ${body.name}`);
   else{
    let sql2 = "INSERT INTO students(name,course,grade,city) values (?,?,?,?)";
  connection.query(sql2,[body.name,body.course,body.grade,body.city],function(err,result){
  if(err){
     console.log(err);
     res.status(404).send("Error in inserting data");
  }
  else res.send(`Post success. Id of new student is ${result.insertId}`);
 });
       
   }
  });
 });

 app.put("/svr/students/:id",function(req,res){
  let id = +req.params.id;
  let body = req.body;
  let connection = getConnection();
  let sql = "UPDATE students SET name=?, course=?, grade=?, city=? WHERE id=?";
  let params = [body.name,body.course,body.grade,body.city,id];
  connection.query(sql,params,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in updating data");
    }
    else if(result.affectedRows===0) res.status(404).send("No update happened");
    else res.send("Update success");
  });
 });

 app.delete("/svr/students/:id",function(req,res){
  let id = +req.params.id;
  let connection = getConnection();
  let sql = "DELETE FROM students WHERE id=?";
  connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in deleting data");
    }
    else if(result.affectedRows===0) res.status(404).send("No delete happened");
    else res.send("Delete success");
  });
 });

 app.get("/svr/resetData",function(req,res){
  let connection = getConnection();
  let sql1 = "TRUNCATE TABLE students";
  connection.query(sql1,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in deleting data");
    }
    else{
      console.log(`Deletion success.Deleted ${result.affectedRows} rows`);
      let {studentsData} = require("./studentData.js");
      let arr = studentsData.map((st) => [st.name,st.course,st.grade,st.city]);
      let sql2 = "INSERT INTO students(name,course,grade,city) VALUES ?";
      connection.query(sql2,[arr],function(err,result){
        if(err){
           console.log(err);
           res.status(404).send("Error in inserting data");
        }
        else res.send(`Reset success. Inserted ${result.affectedRows} rows`);
      });

    } 
  });

 });