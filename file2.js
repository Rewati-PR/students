let fs = require("fs");
let readLine = require('readline-sync');

let fname = readLine.question("Enter name of file:");
let txt = readLine.question("Enter text to be appended to file:");

fs.access(fname, function(err){
    if(err){
        //file does not exist
        fs.writeFile(fname,txt,function(err){
         if(err) console.log(err);
         else{
            console.log("Write Successful");
            fs.readFile(fname,"utf8",function(err1,content1){
              if(err1) console.log(err1);
              else console.log(content1);
            });
         }
        });
    } 
    else{
        //file exists
        fs.readFile(fname,"utf8",function(err,content){
            if(err) console.log(err);
            else{
                 console.log("Before::",content);
                 fs.appendFile(fname,txt,function(err){
                    if(err) console.log(err);
                    else{
                      console.log("Append Successful");
                      fs.readFile(fname,"utf8",function(err,content){
                        if(err) console.log(err);
                        else console.log("After::",content);
                      });
                    }
                 });
                };
        }); 
    }
});
