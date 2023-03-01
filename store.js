let fs = require("fs");
const { clearScreenDown } = require("readline");
let readLine = require('readline-sync');

let fname = "myFile.txt";
let txt = readLine.question("Choose Input Option 1 ,2, 3 Or 4 :");
if(txt==='1'){
    fs.writeFile(fname,'0', function(err){
        console.log("Create/Reset:",fname);
        if(err) console.log(err);
    });
 }
 if(txt==='2'){
    fs.readFile(fname,"utf8",function(err,content){
       if(err) console.log(err);
       else console.log("Read Data:",content);
    });
 }
 if(txt==='3'){
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let num = +content + 1;
            fs.writeFile(fname,'1', function(err){
                console.log("Increment:",num);
                if(err) console.log(err);
            });
        };
    });
 }
 if(txt==='4'){
    fs.readFile(fname,"utf8",function(err,content){
        if(err) console.log(err);
        else{
            let num = +content - 1;
            fs.writeFile(fname,'0', function(err){
                console.log("Decrement:",num);
                if(err) console.log(err);
            });
        };
    });
 }
 
 


