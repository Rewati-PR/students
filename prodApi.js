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

let { prodData } = require("./prodData.js");
let fs = require("fs");
let fname = "prod.json";

app.get("/resetData", function (req, res) {
  let data = JSON.stringify(prodData);
  fs.writeFile(fname, data, function (err) {
    if (err) res.status(404).send(err);
    else res.send("Data in file is reset");
  });
});

app.get("/shops", function (req, res) {
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      res.send(obj.shops);
    }
  });
});
app.get("/shops/:id", function (req, res) {
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let shop = obj.shops.find((sh) => sh.shopId === id);
        if (shop) res.send(shop);
        else res.status(404).send("No Purchase found");
      }
    });
  });


app.post("/shops", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      let maxid = obj.shops.reduce(
        (acc, curr) => (curr.shopId > acc ? curr.shopId : acc),
        0
      );
      let newid = maxid + 1;
      let newShop = { shopId: newid, ...body };
      obj.shops.push(newShop);
      let data1 = JSON.stringify(obj);
      fs.writeFile(fname, data1, function (err) {
        if (err) res.status(404).send(err);
        else res.send(newShop);
      });
    }
  });
});

app.get("/products", function (req, res) {
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      res.send(obj.products);
    }
  });
});

app.get("/products/:id", function (req, res) {
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let product = obj.products.find((sh) => sh.productId === id);
        if (product) res.send(product);
        else res.status(404).send("No Product found");
      }
    });
});

app.post("/products", function (req, res) {
  let body = req.body;
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      let maxid = obj.products.reduce(
        (acc, curr) => (curr.productId > acc ? curr.productId : acc),
        0
      );
      let newid = maxid + 1;
      let newProduct = { productId: newid, ...body };
      obj.products.push(newProduct);
      let data1 = JSON.stringify(obj);
      fs.writeFile(fname, data1, function (err) {
        if (err) res.status(404).send(err);
        else res.send(newProduct);
      });
    }
  });
});

app.put("/products/:id", function (req, res) {
  let id = +req.params.id;
  let body = req.body;
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let Array = JSON.parse(data);
      let index = Array.products.findIndex((p) => p.productId === id);
      if (index >= 0) {
        let updatedProd = {
          productId: Array.products[index].productId,
          productName: Array.products[index].productName,
          category: body.category,
          description: body.description,
        };
        Array.products[index] = updatedProd;
        let data1 = JSON.stringify(Array);
        fs.writeFile(fname, data1, function (err) {
          if (err) res.status(404).send(err);
          else res.send(updatedProd);
        });
      } else res.status(404).send("No product found");
    }
  });
});

app.get("/purchases", function (req, res) {
  let products = req.query.products;
  let store = +req.query.store;
  let sort = req.query.sort;
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      let arr1 = obj.purchases;
      if (products)  {
        let prodArr = products.split(",");
        arr1 = arr1.filter((p)=> prodArr.find(pr=> +pr === +p.productid));
      }
      if (store)  {
        arr1 = arr1.filter((p)=> p.shopId === store);
      }
       if(sort){
      if(sort === "QtyAsc")
       arr1.sort((p1,p2)=>(p1.quantity)-(p2.quantity));
       if(sort === "QtyDesc")
       arr1.sort((p1,p2)=>(p2.quantity)-(p1.quantity));
       if(sort === "ValueAsc")
       arr1.sort((p1,p2)=>(p1.quantity*p1.price)-(p2.quantity*p2.price));
       if(sort === "ValueDesc")
       arr1.sort((p1,p2)=>(p2.quantity*p2.price)-(p1.quantity*p1.price));
      }
      
      res.send(arr1);
    }
  });
});

app.get("/purchases/shops/:id", function (req, res) {
  let id = +req.params.id;
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) res.status(404).send(err);
    else {
      let obj = JSON.parse(data);
      let shop = obj.purchases.filter((sh) => sh.shopId === id);
      if (shop) res.send(shop);
      else res.status(404).send("No shop found");
    }
  });
});

app.get("/purchases/products/:id", function (req, res) {
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let product = obj.purchases.filter((pr) => pr.productid === id);
        if (product) res.send(product);
        else res.status(404).send("No product found");
      }
    });
  });

app.get("/totalPurchase/shop/:id", function (req,res){
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let pr1 = obj.purchases.filter(pr=>pr.shopId === id);
        console.log(pr1.length);
        res.send(pr1);
      }
    });
});
app.get("/totalPurchase/product/:id", function (req,res){
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let pr1 = obj.purchases.filter(pr=>pr.productid === id);
        console.log(pr1.length);
        res.send(pr1);
      }
    });
});


app.get("/purchases/:id", function (req, res) {
    let id = +req.params.id;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let purchase = obj.purchases.find((sh) => sh.purchaseId === id);
        if (purchase) res.send(purchase);
        else res.status(404).send("No Purchase found");
      }
    });
  });

  
app.post("/purchases", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, data) {
      if (err) res.status(404).send(err);
      else {
        let obj = JSON.parse(data);
        let maxid = obj.purchases.reduce(
          (acc, curr) => (curr.purchaseId > acc ? curr.purchaseId : acc),
          0
        );
        let newid = maxid + 1;
        let newPurchase = { purchaseId: newid, ...body };
        obj.purchases.push(newPurchase);
        let data1 = JSON.stringify(obj);
        fs.writeFile(fname, data1, function (err) {
          if (err) res.status(404).send(err);
          else res.send(newPurchase);
        });
      }
    });
  });