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
var port = 2410;

app.listen(port, () => console.log(`Node app listening on port ${port}!`));

let {getConnection} = require("./prodDB.js");
/*
app.get("/resetData",function(req,res){
    let connection = getConnection();
    let sql1 = "TRUNCATE TABLE purchases";
    connection.query(sql1,function(err,result){
      if(err){
         console.log(err);
         res.status(404).send("Error in deleting data");
      }
      else{
        console.log(`Deletion success.Deleted ${result.affectedRows} rows`);
        let {prodData} = require("./prodData.js");
        let arr = prodData.purchases.map((m) => [m.shopId,m.productid,m.quantity,m.price]);
        let sql2 = "INSERT INTO purchases(shopId,productid,quantity,price) VALUES ?";
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
app.get("/shops",function (req,res){
    let connection = getConnection();
 let sql = "SELECT * FROM shops";
 connection.query(sql,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else res.send(result);
 });
});
app.get("/shops/:id",function(req,res){
    let id = +req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM shops WHERE shopId=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else if(result.length===0)
     res.status(404).send("No shop found");
    else res.send(result[0]);
   });
});
app.post("/shops",function(req,res){
   let body = req.body;
   let connection = getConnection();
   let sql = "INSERT INTO shops(name,rent) values (?,?)";
   connection.query(sql,[body.name,body.rent],function(err,result){
   if(err){
      console.log(err);
      res.status(404).send("Error in inserting data");
   }
   else res.send(`Post success. Id of new shop is ${result.insertId}`);
  });
});
app.get("/products",function (req,res){
    let connection = getConnection();
 let sql = "SELECT * FROM products";
 connection.query(sql,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else res.send(result);
 });
});

app.get("/products/:id",function(req,res){
    let id = +req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM products WHERE productId=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else if(result.length===0)
     res.status(404).send("No product found");
    else res.send(result[0]);
   });
});
app.post("/products",function(req,res){
    let body = req.body;
    let connection = getConnection();
    let sql = "INSERT INTO products(productName,category,description) values (?,?,?)";
    connection.query(sql,[body.productName,body.category,body.description],function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in inserting data");
    }
    else res.send(`Post success. Id of new product is ${result.insertId}`);
   });
 });


 app.put("/products/:id",function(req,res){
    let id = +req.params.id;
    let body = req.body;
    let connection = getConnection();
    let sql = "UPDATE products SET  category=?, description=? WHERE productId=?";
    let params = [body.category,body.description,id];
    connection.query(sql,params,function(err,result){
      if(err){
         console.log(err);
         res.status(404).send("Error in updating data");
      }
      else if(result.affectedRows===0) res.status(404).send("No update happened");
      else res.send("Update success");
    });
});
app.get("/purchases",function (req,res){
    let products = req.query.products;
    let store = req.query.store;
    let sort = req.query.sort;  
    let connection = getConnection();
    let options = "";
    let optionsArr = [];
    if (products)  {
     let prodArr = products.split(",");
     options = " Where productid IN (?) ";
     optionsArr.push(prodArr);
   }
   if(store){
    options = options ? `${options} AND shopId=?` : " Where shopId=? ";
    optionsArr.push(store);
  }
  if(sort){
    if(sort==="QtyAsc") options = `${options} ORDER BY quantity ASC`;
    if(sort==="QtyDesc") options = `${options} ORDER BY quantity DESC`;
    if(sort==="ValueAsc") options = `${options} ORDER BY quantity*price ASC`;
    if(sort==="ValueDesc") options = `${options} ORDER BY quantity*price DESC`;
  }
   let sql = `SELECT * FROM purchases ${options}`;
   
 connection.query(sql,optionsArr,function(err,result){
 if(err){
    console.log(err);
    res.status(404).send("Error in fetching data");
 }
 else res.send(result);
 });
});

app.get("/purchases/shops/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM purchases WHERE shopId=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else res.send(result);
   });
 });

 app.get("/purchases/products/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM purchases WHERE productid=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else res.send(result);
   });
 });

 app.get("/totalPurchase/shop/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM purchases WHERE shopId=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else res.send(result);
   });
 });

 app.get("/totalPurchase/product/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM purchases WHERE productid=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else res.send(result);
   });
 });

 app.get("/purchases/:id",function(req,res){
    let id = req.params.id;
    let connection = getConnection();
    let sql = "SELECT * FROM purchases WHERE purchaseId=?";
    connection.query(sql,id,function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in fetching data");
    }
    else if(result.length===0)
     res.status(404).send("No purchase data found");
    else res.send(result[0]);
   });
});

app.post("/purchases",function(req,res){
    let body = req.body;
    let connection = getConnection();
    let sql = "INSERT INTO products(shopId,productid,quantity,price) values (?,?,?,?)";
    connection.query(sql,[body.shopId,body.productid,body.quantity,body.price],function(err,result){
    if(err){
       console.log(err);
       res.status(404).send("Error in inserting data");
    }
    else res.send(`Post success. Id of new purchase is ${result.insertId}`);
   });
 });
