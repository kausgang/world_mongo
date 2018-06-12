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

  console.log(filename);

  

  var content = fs.readFileSync(filename);

  var data = JSON.parse(content);
  // console.log(data);

  res.send(data);
}
module.exports = router;
