var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  
    var selected_person = req.query.name;

    about_person(selected_person,res);

});


function about_person(name,res){




    var filename = path.join(__dirname,'../public/PERSONALITY/personality.csv');

  
  // READ CSV FILE NODEJS
  // https://stackoverflow.com/questions/23080413/nodejs-reading-csv-file
  var csvData=[];
  
  fs.createReadStream(filename)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);        
        
    })
    .on('end',function() {
      //do something wiht csvData
     
      //THE FIRST ROW IS HEADING
    //   csvData.shift();


    //   FIND ALL THE ENTRIES WITH THAT NAME
        // var records = [];
        var born = [];
        var died = [];
        var countries = [];
        
        csvData.forEach(element => {
            
            // element[0] now contains names
            if(name == element[0]){
                
                // records.push(element);
                born.push(element[1]);
                died.push(element[2]);
                countries.push(element[3]);



            }
                


        });

        console.log(countries)


       
          

        // record array now holds all the records returned by the search
        // FIND THE MIN-MAX YEAR
        // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
        var min = Math.min.apply(null,born);
        var max = Math.max.apply(null,died);
        var country = countries[0];//TO HOLD THE FIRST COUNTRY SO THAT THE PERSONALITY MAP CAN BE SHOWN
        console.log(country)
        res.render('selected_person',
                    {
                        min:min,
                        max:max,
                        country:country,
                        countries:countries,
                        name:name
                    })


    });
}

module.exports = router;
