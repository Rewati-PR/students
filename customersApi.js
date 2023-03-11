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

let {customersData} = require("./customersData.js");
let fs = require("fs");
let fname = "customers.json";

app.get("/resetData", function (req, res) {
  let data = JSON.stringify(customersData);
  fs.writeFile(fname, data, function (err) {
    if (err) res.status(404).send(err);
    else res.send("Data in file is reset");
  });
});

app.get("/customers", function (req, res) {
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let customersArray = JSON.parse(data);
        res.send(customersArray);
      }
    });
});

app.post("/customers", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let customersArray = JSON.parse(data);
        let maxid = customersArray.reduce(
          (acc, curr) => (curr.id > acc ? curr.id : acc),
          0
        );
        let newid = maxid + 1;
        let newCustomer = { id: newid, ...body };
        customersArray.push(newCustomer);
        let data1 = JSON.stringify(customersArray);
        fs.writeFile(fname,data1,function(err){
          if (err) res.status(404).send(err);
          else res.send(newCustomer);
        });
      }
    });
  });
  
  app.put("/customers/:id", function (req, res) {
      let id = +req.params.id;
      let body = req.body;
      fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
          let customersArray = JSON.parse(data);
          let index = customersArray.findIndex((st) => st.id === id);
          if (index >= 0) {
              let updatedCustomer = { ...customersArray[index], ...body };
              customersArray[index] = updatedCustomer;
              let data1 = JSON.stringify(customersArray);
              fs.writeFile(fname,data1,function(err){
                  if (err) res.status(404).send(err);
                  else res.send(updatedCustomer);
                });
            }
          else res.status(404).send("No customer found");
        }
      });
    
  });
  
  app.delete("/customers/:id", function (req, res) {
      let id = req.params.id;
      fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
          let customersArray = JSON.parse(data);
          let index = customersArray.findIndex((st) => st.id === id);
          if (index >= 0) {
              let deleteCustomer = customersArray.splice(index, 1);
              let data1 = JSON.stringify(customersArray);
              fs.writeFile(fname,data1,function(err){
                  if (err) res.status(404).send(err);
                  else res.send(deleteCustomer);
                });
            }
          else res.status(404).send("No customer found");
        }
      });
  });
  