var fs = require('fs');
var path = require('path');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

  console.log(req.query);
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

      console.log('loaded');
      console.log(data)
      if(typeof country_data !== 'undefined'){  //the country exists

        country_data.push(event);
       
        // DELETE THE COUNTRYS ENTRY 
        delete data[country];
        
        // AND ADD BACK
        data[country] = country_data;
        
        // WRITE THE UPDATE TO FILE
        fs.writeFileSync(filename,JSON.stringify(data, null, 2))
        
        // SHOW WHAT UPDATE TOOK PLACE
        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('evaluate',param)
      } 
      else{ //FILE EXISTS BUT COUNTRY DOESNOT
        // CREATE A NEW ARRAY TO HOLD THE EVENT AND CREATE A OBJECT TO HOLD THE COUNTRY DATA
       
        var event_array = [];
        event_array.push(event);
        
        data[country] = event_array;
        
        // write_back_to_file(data,country,new_country);
        fs.writeFileSync(filename,JSON.stringify(data, null, 2))

        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('evaluate',param)

      }
    }
    else{ //FILE DOESNOT EXTST

      var new_country = {};
      var event_array = [];
      event_array.push(event);
      
      new_country.year = year;
      new_country[country] = event_array;

       // write_back_to_file(data,country,new_country);
       fs.writeFileSync(filename,JSON.stringify(new_country, null, 2))

       var param = {
         year: year,
         country: country,
         event: event
      }
       res.render('evaluate',param)

    }
  })

}



module.exports = router;
