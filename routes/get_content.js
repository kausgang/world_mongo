var fs = require("fs");
var path = require('path');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });

  var year = req.query.year;
  console.log(year);

  get_content(year,res);
});

function get_content(year,res){

  var filename = path.join(__dirname,'../public/DATABASE/'+year+'.json');

  // console.log(filename);

  

  var content = fs.readFileSync(filename);

  var data = JSON.parse(content);
  // console.log(data);


  //get the country name and write in a file for d3
  var country = [];
  var country_filename = path.join(__dirname,'../public/country.csv');
  
  Object.keys(data).forEach(function(key){
    var value = data[key];
    // console.log(key + ':####' + value);
    country.push(key);  
    // return country;
  });
  // remove the first item i.e year
  country.shift();
  //write it to file
  fs.writeFileSync(country_filename,country);

  res.send('country.csv'); //sending only the filename as d3 cannlot load local file in chrome
}
module.exports = router;
