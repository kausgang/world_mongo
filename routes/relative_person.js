var fs = require('fs');
var path = require('path');
var parse = require('csv-parse');


var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) { //CHANGED HERE
  
  // res.render('relative_person')

  relative_person(res);
});



function relative_person(res){

  var filename = path.join(__dirname,'../public/PERSONALITY/personality.csv');

  
  // READ CSV FILE NODEJS
  // https://stackoverflow.com/questions/23080413/nodejs-reading-csv-file
  var csvData=[];
  var names_original = [];
  fs.createReadStream(filename)
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        // console.log(csvrow);
        //do something with csvrow
        csvData.push(csvrow);        
        names_original.push(csvrow[0]);
    })
    .on('end',function() {
      //do something wiht csvData
      
     


      // FIND ALL THE UNIQUE NAMES FROM NAMES ARRAY
      // https://stackoverflow.com/questions/23237704/nodejs-how-to-remove-duplicates-from-array
      var names = names_original.filter(function(elem, pos) {
        return names_original.indexOf(elem) == pos; //INDEXOF FINDS THE FIRST OCCURANCE OF THE ITEM
      })

      //THE FIRST ROW IS HEADING
      names.shift();
      // console.log(names);

      // AS THERE IS NO WAY TO ACCESS THE NAMES VALUE FROM EJS BY THE JAVASCRIPT, 
      // WRITING THE VALUE IN FILE AND SOURCING THE FILE IN SEARCH_PERSON
      // UPDATE : - THERE IS ONE WAY TO READ EJS VARIABLE BY JS
      // https://stackoverflow.com/questions/16098397/pass-variables-to-javascript-in-expressjs/16098699
      // THIS METHOD IS USED IN SELECTED_PERSON.EJS
      var updated_names = [];
      names.forEach(element => {
        updated_names.push('"' + element + '"') ;
      });
      var filename = path.join(__dirname,'../public/person_names_for_search.js');
      
      //WRITE THE FILE IN ASYNC MODE TO LOAD THE PAGE QUICKLY
      // fs.writeFileSync(filename,"var names = ["+updated_names+']');
      fs.writeFile(filename,"var names = ["+updated_names+']',(err)=>{
        if(err) throw err;
      });

      res.render('relative_person');
      


   
      
     
     
    })

}




module.exports = router;
