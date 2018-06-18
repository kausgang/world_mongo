var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

  // console.log(req.query);
  var year = req.query.year;
  var country = req.query.country;
  var event = req.query.event;

  update_year(year,country,event,res);
  // res.send("hi")
});

function update_year(year,country,event,res){

  var filename = path.join(__dirname,'../public/DATABASE/'+year+'.json');
  fs.exists(filename,function(exists){

    if(exists){

      var content = fs.readFileSync(filename);
      var data = JSON.parse(content);
      // CHECK IF COUNTRY EXISTS
      var country_data = data[country];

      console.log(country_data)
      if(typeof country_data !== 'undefined'){  //the country exists

        country_data.push(event)
        // console.log(country_data)
      } 
      else{
        // CREATE A NEW ARRAY TO HOLD THE EVENT AND CREATE A OBJECT TO HOLD THE COUNTRY DATA
        var new_country = {};
        var event_array = [];
        event_array.push(event);
        new_country[country] = event_array
        console.log(new_country)

      }
    }
    else{


    }
  })

}

module.exports = router;
