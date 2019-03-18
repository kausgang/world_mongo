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

  var database = req.app.database;
  var collection = req.app.collection;
  // update_year(year,country,event,res);
  update_year(year,country,event,req.app.conn,database,collection,res);
  
});


function update_year(year,country,event,conn,database,collection,res){

  // check if that year exists in db
  conn.db(database).collection(collection).findOne({'year':year},(err,data)=>{
    // console.log(result)
    if(err) throw err;
    // YEAR FOUND
    
    // console.log(data);;

    if(data){
      // CHECK IF COUNTRY EXISTS
      var country_data = data[country];
      if(typeof country_data !== 'undefined'){  //the country exists
        country_data.push(event);
        // DELETE THE COUNTRYS ENTRY 
        delete data[country];
        // AND ADD BACK
        data[country] = country_data;
        delete data['_id'];//delete the id as this will be provided by mongodb
        // TYPE MESSAGE FOR SYSTEM ADMIN
        // DROP the ORIGINAL & WRITE THE UPDATE TO database
        conn.db(database).collection(collection).deleteOne({"year":year},(err,res)=>{
          if(err) throw err;
          console.log(res.opts);
        })
        conn.db(database).collection(collection).insertOne(data,(err,res)=>{
          if(err) throw err;
          console.log(res.opts);
        })
        // SHOW WHAT UPDATE TOOK PLACE
        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('update_year',param)
      } 
      else{ //FILE EXISTS BUT COUNTRY DOESNOT
        // CREATE A NEW ARRAY TO HOLD THE EVENT AND CREATE A OBJECT TO HOLD THE COUNTRY DATA
        var event_array = [];
        event_array.push(event);
        data[country] = event_array;
        // TYPE MESSAGE FOR SYSTEM ADMIN
        // console.log('adding to country database - filename = '+ filename + ' new data '+ data)
        delete data['_id'];//delete the id as this will be provided by mongodb
        // DROP the ORIGINAL & WRITE THE UPDATE TO database
        conn.db(database).collection(collection).deleteOne({"year":year},(err,res)=>{
          if(err) throw err;
          console.log(res.opts);
        })
        conn.db(database).collection(collection).insertOne(data,(err,res)=>{
          if(err) throw err;
          console.log(res.opts);
        })
        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('update_year',param)

      
    }
  }
    if(!data){ //the year doesn't exist
    var new_country = {};
      var event_array = [];
      event_array.push(event); 
      new_country.year = year;
      new_country[country] = event_array;
      // TYPE MESSAGE FOR SYSTEM ADMIN
      // console.log('adding to country database - new file'+ filename + ' new data '+ new_country)
      conn.db(database).collection(collection).insertOne(new_country,(err,res)=>{
        if(err) throw err;
        console.log(res.opts);
      })
       var param = {
         year: year,
         country: country,
         event: event
      }
       res.render('update_year',param)


    }
  })
}


/*

function update_year(year,country,event,res){

  var filename = path.join(__dirname,'../public/DATABASE/'+year+'.json');
  fs.exists(filename,function(exists){

    if(exists){

      var content = fs.readFileSync(filename);
      var data = JSON.parse(content);
      // CHECK IF COUNTRY EXISTS
      var country_data = data[country];

      // console.log('loaded');
      // console.log(data)
      if(typeof country_data !== 'undefined'){  //the country exists

        country_data.push(event);
       
        // DELETE THE COUNTRYS ENTRY 
        delete data[country];
        
        // AND ADD BACK
        data[country] = country_data;

        // TYPE MESSAGE FOR SYSTEM ADMIN
        console.log('adding to country database , filename = '+filename+' new event'+data)

        
        // WRITE THE UPDATE TO FILE
        fs.writeFileSync(filename,JSON.stringify(data, null, 2))
        
        // SHOW WHAT UPDATE TOOK PLACE
        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('update_year',param)
      } 
      else{ //FILE EXISTS BUT COUNTRY DOESNOT
        // CREATE A NEW ARRAY TO HOLD THE EVENT AND CREATE A OBJECT TO HOLD THE COUNTRY DATA
       
        var event_array = [];
        event_array.push(event);
        
        data[country] = event_array;

        // TYPE MESSAGE FOR SYSTEM ADMIN
        console.log('adding to country database - filename = '+ filename + ' new data '+ data)
        
        // write_back_to_file(data,country,new_country);
        fs.writeFileSync(filename,JSON.stringify(data, null, 2))

        var param = {
          year: year,
          country: country,
          event: event
        }
        res.render('update_year',param)

      }
    }
    else{ //FILE DOESNOT EXTST

      var new_country = {};
      var event_array = [];
      event_array.push(event);
      
      new_country.year = year;
      new_country[country] = event_array;

      // TYPE MESSAGE FOR SYSTEM ADMIN
    console.log('adding to country database - new file'+ filename + ' new data '+ new_country)


       // write_back_to_file(data,country,new_country);
       fs.writeFileSync(filename,JSON.stringify(new_country, null, 2))

       var param = {
         year: year,
         country: country,
         event: event
      }
       res.render('update_year',param)

    }
  })

}

*/


module.exports = router;
