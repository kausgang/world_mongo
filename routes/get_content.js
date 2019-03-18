var fs = require("fs");
var path = require('path');
// var MongoClient = require('mongodb').MongoClient;

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

// need this to parse csv
  // var host = req.headers.host; 
  var host = req.headers.referer; //sends http://<server>:<port> or https://<server>:<port>

  var year = req.query.year;
  //PRINT CONSOLE MESSAGE FOR SYSTEM ADMIN
  console.log("used selected year "+ year)

  // ORIGINAL FILE BASED FUNCTION
  // get_content(year,host,res);
  var database = req.app.database;
  var collection = req.app.collection;

  get_content(year,host,res,req.app.conn,database,collection);

});

// ORIGINAL FILE BASED OPERATION
/*
function get_content(year,host,res){

  var filename = path.join(__dirname,'../public/DATABASE/'+year+'.json');

  // console.log(filename);
  var data;
  var db_found = true;

  fs.exists(filename,function(exists){

    if(exists){
      var content = fs.readFileSync(filename);

      data = JSON.parse(content);
      // console.log(data);
    
    
      //get the country name and write in a file for d3
      
      var country_filename = path.join(__dirname,'../public/country.csv');
      fs.writeFileSync(country_filename,'country\n') //CREATING HEADER FOR THE CSV FILE
      var i =1; //first value is "year"
    
      Object.keys(data).forEach(function(key){
        var value = data[key];
        // console.log(key + ':####' + value);
         
        if(i!=1) //THE FIRST VALUE IS "year"
        fs.appendFileSync(country_filename,key+'\n');
        i++;
        
      });
    

      var csv_filename = 'http://'+host+'/country.csv';

      var obj = {
        content: data,
        csv_filename: csv_filename,
        file_present: db_found
      }
    
      res.send(obj); //sending the url to access the file on server, sometimes  chrome cannlot load local file in 

    }
    else{
      
      // CREATE A DUMMY FILE AND SEND IT
      var dummy_data = {};
      dummy_data.year = year;
      console.log(dummy_data);
      fs.writeFileSync(filename,JSON.stringify(dummy_data,null,2))
      
      db_found = false;
      var obj = {
        // content: data,
        csv_filename: csv_filename,
        file_present: db_found
      }
    
      res.send(obj);
    }

  })

 

 
}

*/



// MONGODB BASED OPERATION
function get_content(year,host,res,conn,database,collection){

  // check if that year exists in db
  conn.db(database).collection(collection).findOne({'year':year},(err,data)=>{
  // console.log(result)
  if(err) throw err;
 

  // YEAR NOT FOUND
    // var data;
    if(!data) // CREATE NEW DOCUMENT IN MONGODB
    {
      var db_found = false;
      var myobj={year:year};
      // console.log(myobj)
      conn.db(database).collection(collection).insertOne(myobj,(err,res)=>{
        if(err) throw err;
        // console.log(res);
      }) 
    }
    else{ //YEAR FOUND
      var db_found = true;  
      //get the country name and write in a file for d3     
      var country_filename = path.join(__dirname,'../public/country.csv');
      fs.writeFileSync(country_filename,'country\n') //CREATING HEADER FOR THE CSV FILE
      var i =1; 
      Object.keys(data).forEach(function(key){
        var value = data[key];     
        if(i!=1 && i!=2) //THE FIRST VALUE IS "_id" & 2nd is "year" for mongodb
        fs.appendFileSync(country_filename,key+'\n');
        i++;
      });
    }
    // var csv_filename = 'http://'+host+'/country.csv';
    var csv_filename = host+'/country.csv';
    var obj = {
      content: data,
      csv_filename: csv_filename,
      file_present: db_found
    }

  res.send(obj); //sending the url to access the file on server, sometimes  chrome cannlot load local file in 


  });

 
}


module.exports = router;
