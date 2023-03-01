let fs = require("fs");
let readLine = require("readline-sync");
let fname = "data1.json";
let mainJson = { A: 0, B: 0 };

function createJson() {
  let str = JSON.stringify(mainJson);
  fs.writeFile(fname, str, function (err) {
    if (err) console.log(err);
    else console.log("Write the Data");
  });
}

function readJson() {
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) console.log(err);
    else {
      let obj = JSON.parse(data);
      console.log(obj);
    }
  });
}
function incrementA() {
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) console.log(err);
    else {
      let obj = JSON.parse(data);
      obj.A = +obj.A + 1;
      let data1 = JSON.stringify(obj);
      fs.writeFile(fname, data1, function (err) {
        if (err) console.log(err);
        else console.log("Data updated increament A");
      });
    }
  });
}
function incrementB() {
  fs.readFile(fname, "utf8", function (err, data) {
    if (err) console.log(err);
    else {
      let obj = JSON.parse(data);
      obj.B = +obj.B + 1;
      let data1 = JSON.stringify(obj);
      fs.writeFile(fname, data1, function (err) {
        if (err) console.log(err);
        else console.log("Data updated increament B");
      });
    }
  });
}

let option = readLine.question(
  "Enter option 1:Create/Reset 2:Read 3:IncrementA 4.IncrementB -"
);
switch (option) {
  case "1":
    createJson();
    break;
  case "2":
    readJson();
    break;
  case "3":
    incrementA();
    break;
  case "4":
    incrementB();
    break;
}
