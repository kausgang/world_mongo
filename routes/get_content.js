var fs = require("fs");
var path = require('path');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  

// need this to parse csv
  var host = req.headers.host; 


// console.log(host);

  var year = req.query.year;
  //PRINT CONSOLE MESSAGE FOR SYSTEM ADMIN
  console.log("used selected year "+ year)

  get_content(year,host,res);
});

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
module.exports = router;
