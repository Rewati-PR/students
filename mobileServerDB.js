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

let {getConnection} = require("./mobileDB.js");

app.get("/svr/mobiles",function (req,res){
   let brand = req.query.brand;
   let RAM = req.query.RAM;
   let ROM = req.query.ROM;
 
 let connection = getConnection();
 let options = "";
 let optionsArr = [];
 if (brand)  {
  let brandArr = brand.split(",");
  options = " Where brand IN (?) ";
  optionsArr.push(brandArr);
}
if(RAM){
   let ramArr = RAM.split(",");
  options = options ? `${options} AND RAM IN (?)` : " Where RAM IN (?) ";
  optionsArr.push(ramArr);
}
if(ROM){
   let romArr = ROM.split(",");
   options = options ? `${options} AND ROM IN (?)` : " Where ROM IN (?) ";
   optionsArr.push(romArr);
 }
 let sql = `SELECT * FROM mobiles ${options}`;
 connection.query(sql,optionsArr,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else res.send(result);
 });
});

app.get("/svr/mobiles/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM mobiles WHERE id=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else if(result.length===0)
     res.status(404).send("No mobile found");
    else res.send(result[0]);
   });
});
app.post("/svr/mobiles",function(req,res){
   let body = req.body;
   let connection = getConnection();
   let sql = "INSERT INTO mobiles(name,price,brand,RAM,ROM,OS) values (?,?,?,?,?,?)";
   connection.query(sql,[body.name,body.price,body.brand,body.RAM,body.ROM,body.OS],function(err,result){
   if(err){
      console.log(err);
      res.status(404).send("Error in inserting data");
   }
   else res.send(`Post success. Id of new mobile is ${result.insertId}`);
  });
});

app.get("/svr/brand/:brand",function(req,res){
    let brand = req.params.brand;
    let connection = getConnection();
    let sql = "SELECT * FROM mobiles WHERE brand=?";
    connection.query(sql,brand,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else if(result.length===0)
     res.status(404).send("No mobile found");
    else res.send(result);
   });
});

app.put("/svr/mobiles/:id",function(req,res){
    let id = req.params.id;
    let body = req.body;
    let connection = getConnection();
    let sql = "UPDATE mobiles SET name=?, price=?, brand=?, RAM=?, ROM=?, OS=? WHERE id=?";
    let params = [body.name,body.price,body.brand,body.RAM,body.ROM,body.OS,id];
    connection.query(sql,params,function(err,result){
      if(err){
         console.log(err);
         res.status(404).send("Error in updating data");
      }
      else if(result.affectedRows===0) res.status(404).send("No update happened");
      else res.send("Update success");
    });
});

app.delete("/svr/mobiles/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "DELETE FROM mobiles WHERE id=?";
    connection.query(sql,id,function(err,result){
      if(err){
         console.log(err);
         res.status(404).send("Error in deleting data");
      }
      else if(result.affectedRows===0) res.status(404).send("No delete happened");
      else res.send("Delete success");
    });
});
/*
app.get("/svr/resetData",function(req,res){
    let connection = getConnection();
    let sql1 = "TRUNCATE TABLE mobiles";
    connection.query(sql1,function(err,result){
      if(err){
         console.log(err);
         res.status(404).send("Error in deleting data");
      }
      else{
        console.log(`Deletion success.Deleted ${result.affectedRows} rows`);
        let {mobilesData} = require("./mobileData.js");
        let arr = mobilesData.map((m) => [m.name,m.price,m.brand,m.RAM,m.ROM,m.OS]);
        let sql2 = "INSERT INTO mobiles(name,price,brand,RAM,ROM,OS) VALUES ?";
        connection.query(sql2,[arr],function(err,result){
          if(err){
             console.log(err);
             res.status(404).send("Error in inserting data");
          }
          else res.send(`Reset success. Inserted ${result.affectedRows} rows`);
        });
  
      } 
    });
}); */
  