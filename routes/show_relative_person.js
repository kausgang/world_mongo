var fs=require('fs');
var path = require('path');
var parse = require('csv-parse');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  
  var name1 = req.query.name1;
  var name2 = req.query.name2;
  show_relative_person(name1,name2,res)
});


function show_relative_person(name1,name2,res){

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
      csvData.shift();


    //   FIND ALL THE ENTRIES WITH THAT NAME
        // var records = [];
        var born1 = [];
        var died1 = [];
        var picture1 = [];
        var wikipedia_url1 = [];
        var born2 = [];
        var died2 = [];
        var picture2 = [];
        var wikipedia_url2 = [];
        
        
        csvData.forEach(element => {
            
            // element[0] now contains names
            if(name1 == element[0]){
                
                // records.push(element);
                born1.push(element[1]);
                died1.push(element[2]);
                picture1.push(element[4]);
                wikipedia_url1.push(element[5]);
            }
            if(name2 == element[0]){
                
              // records.push(element);
              born2.push(element[1]);
              died2.push(element[2]);
              picture2.push(element[4]);
              wikipedia_url2.push(element[5]);
          }
                


        });

               
          

        // record array now holds all the records returned by the search
        // FIND THE MIN-MAX YEAR
        // https://stackoverflow.com/questions/1669190/find-the-min-max-element-of-an-array-in-javascript
        var name1_born = Math.min.apply(null,born1);
        var name1_died = Math.max.apply(null,died1);
        var name2_born = Math.min.apply(null,born2);
        var name2_died = Math.max.apply(null,died2);
        
        // CHECK FOR CASE WHERE DIED DATE IS NOT ENTERED
        if(name1_died == 0)
            name1_died = 2000;
        if(name2_died == 0)
            name2_died = 2000;

        var age_difference = function(name1_born,name2_born){

            if(name1_born >= name2_born)
              return parseInt(name1_born) - parseInt(name2_born);
            else  
            return parseInt(name2_born) - parseInt(name1_born);
        }


        res.render('show_relative_person',
                    {
                      name1:name1,
                      name1_born:name1_born,
                      name1_died:name1_died,
                      picture1:picture1[0],
                      wikipedia_url1:wikipedia_url1[0],

                      name2:name2,
                      name2_born:name2_born,
                      name2_died:name2_died,
                      picture2:picture2[0],
                      wikipedia_url2:wikipedia_url2[0],
                      
                      age_difference:age_difference
                        
                    })


    })
}

module.exports = router;
