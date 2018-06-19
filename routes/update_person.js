var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');

var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  // res.send('respond with a resource');

  console.log(req.query);
  var name = req.query.name;
  var born = req.query.born;
  var died = req.query.died;
  var country = req.query.country;
  var picture = req.query.picture;
  var wikipedia_url = req.query.wikipedia_url;
  var not_a_person = req.query.not_a_person;

  update_person(name,born,died,country,picture,wikipedia_url,not_a_person,res);
  // res.send("hi")
});

function update_person(name,born,died,country,picture,wikipedia_url,not_a_person,res){

  var filename = path.join(__dirname,'../public/PERSONALITY/personality.csv');
  
  /* // READ CSV FILE NODEJS
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
      // console.log(csvData); 


      // ENTER NEW DATA
      var new_person = [name,born,died,country,picture,wikipedia_url];
      csvData.push(new_person)

      // fs.writeFileSync(filename,'name,born,died,geography,picture,wikipedia_url');
      csvData.forEach(element => {
        
        fs.appendFileSync(filename,element+'\n')
      });
      // console.log(csvData)
      
      

    }); */

    if(typeof not_a_person == 'undefined')
      not_a_person = '';
    var new_person = name+','+born+','+died+','+country+','+picture+','+wikipedia_url+','+not_a_person;
    fs.appendFileSync(filename,new_person+'\n');

    var param = {
      name: name
    }
    res.render('update_person',param)
}



module.exports = router;
