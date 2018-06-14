function reload_map_d3(csv_filename){

    // var csv_file = 'http://'+host+'/'+csv_filename;
    
    // console.log(csv_filename)
    
    // d3.csv('country.csv', function(data) {  //THIS STATEMENT ALSO WORKS
        d3.csv(csv_filename, function(data) {  
        console.log(data);
      });
}