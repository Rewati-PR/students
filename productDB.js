let mysql = require("mysql");
let connData = {
  host: "localhost",
  user: "root",
  password: "rewati14",
  database: "productDB",
};
function showProducts() {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM products";
  connection.query(sql, function (err, result) {
    if (err) console.log(err);
    else console.log(result);
  });
}

function showProductsByName(prod) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM products WHERE prod=?";
  connection.query(sql, prod, function (err, result) {
    if (err) {
      console.log(err);
    } else console.log(result);
  });
}
function showProductsByCategory(cat) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM products WHERE category=?";
  connection.query(sql, cat, function (err, result) {
    if (err) {
      console.log(err);
    } else console.log(result);
  });
}
function showSpecifiedPrice(price) {
  let connection = mysql.createConnection(connData);
  let sql = "SELECT * FROM products WHERE price > ?";
  connection.query(sql, price, function (err, result) {
    if (err) {
      console.log(err);
    } else console.log(result);
  });
} 
function insertProduct(params) {
  let connection = mysql.createConnection(connData);
  let sql =
    "INSERT INTO products(prod,price,quantity,category) VALUES(?,?,?,?)";
  connection.query(sql, params, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log("Id of inserted record : ", result.insertId);
      let sql2 = "SELECT * FROM products";
      connection.query(sql2, function (err, result) {
        if (err) {
          console.log(err);
        } else console.log(result);
      });
    }
  });
}
function insertProducts(params) {
  let connection = mysql.createConnection(connData);
  let sql = "INSERT INTO products(prod,price,quantity,category) VALUES ?";
  connection.query(sql, [params], function (err, result) {
    if (err) console.log(err);
    else {
      let sql2 = "SELECT * FROM products";
      connection.query(sql2, function (err, result) {
        if (err) {
          console.log(err);
        } else console.log(result);
      });
    }
  });
}

function changeQty(id,qty){
    let connection = mysql.createConnection(connData);
    let sql = "UPDATE products SET quantity=? WHERE id=?";
    connection.query(sql,[qty,id], function (err, result) {
      if (err) {
        console.log(err);
      } else console.log(result);
    });
  
}
function resetData(){
    let connection = mysql.createConnection(connData);
    let sql1 = "DELETE FROM products";
    connection.query(sql1, function (err, result) {
      if (err) {
        console.log(err);
      } else{
         console.log("Successfully deleted. Affected rows : ",result.affectedRows);
         let {products} = require("./productData.js");
         let arr = products.map((p)=>[p.prod,p.price,p.quantity,p.category]);
         let sql2 = "INSERT INTO products(prod,price,quantity,category) VALUES ?";
         connection.query(sql2,[arr], function (err, result) {
            if (err) {
              console.log(err);
            } else console.log("Successfully Inserted. Affected rows : ",result.affectedRows);
          });
    };
    });  
 }

 resetData();
//insertProduct(["Silk",50,10,"Shampoo"]);
//showProducts();
//showProductsByName("Pepsi");
// showProductsByCategory("Food");
//showSpecifiedPrice(30);
/*insertProducts([
  ["Life Boy", 20, 15, "Soap"],
  ["Chocobar", 15, 20, "Food"],
]);*/
//changeQty(1,100);
