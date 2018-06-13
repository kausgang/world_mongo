function reload_map_d3(csv_filename){

    console.log('irtgef'+csv_filename)

    //cannot load the csv file
    d3.csv('/a.csv', function(data) {  
        console.log(data);
      });
}