function reload_map_d3(csv_filename,content,year){


    
    
    
    // d3.csv('country.csv', function(data) {  //THIS STATEMENT ALSO WORKS
    //d3.csv(csv_filename, function(data) {  
    //     console.log(data);
    //   });


    var width = 860,
    height = 500,
    rotate = 0,        // so that [-60, 0] becomes initial center of projection
    maxlat = 83;        // clip northern and southern poles (infinite in mercator)
    
var projection = d3.geo.mercator()
    .rotate([rotate,0])
    .scale(1)           // we'll scale up to match viewport shortly.
    .translate([width/2, height/2]);

// find the top left and bottom right of current projection
function mercatorBounds(projection, maxlat) {
    var yaw = projection.rotate()[0],
        xymax = projection([-yaw+180-1e-6,-maxlat]),
        xymin = projection([-yaw-180+1e-6, maxlat]);
    
    return [xymin,xymax];
}

// set up the scale extent and initial scale for the projection
var b = mercatorBounds(projection, maxlat),
    s = width/(b[1][0]-b[0][0]),
    scaleExtent = [s, 10*s];

projection
    .scale(scaleExtent[0]);

var zoom = d3.behavior.zoom()
    .scaleExtent(scaleExtent)
    .scale(projection.scale())
    .translate([0,0])               // not linked directly to projection
    .on("zoom", redraw);
    
var path = d3.geo.path()
    .projection(projection);

// var svg = d3.selectAll('body')
//     .append('svg')
//         .attr('width',width)
//         .attr('height',height)
//         .call(zoom);

var svg = d3.select('#globe')
    .attr("width", width)
    .attr("height", height)
        .call(zoom);

queue()
    .defer(d3.json, "https://raw.githubusercontent.com/kausgang/interactive_world_map/master/ne_110m_admin_0_countries.json")
    .defer(d3.csv, csv_filename)
    .defer(d3.csv, '/PERSONALITY/personality.csv')
    .await(ready);


// d3.json("https://raw.githubusercontent.com/kausgang/interactive_world_map/master/ne_110m_admin_0_countries.json", function(error, world){
// function ready(error,world,names){
function ready(error,world,names,person){ //ARGUMENTS HERE WILL BE IN ORDER OF THE DEFER STATEMENTS ABOVE

    if (error) throw error;


    var formatted_array1 = [];
    var formatted_array2 = [];
    var geography = [];
    //  console.log(person);
    
      // GET ALL THE PEOPLE LIVING IN THAT YEAR

     person.forEach(element => {
    
        var birth_year = parseInt(element.born);
           
            if(birth_year <= year){ //all the people was born before this year

                formatted_array1.push(element); 
            }

     
    });


    formatted_array1.forEach(element => {
            
        // var death_year = parseInt(element.died);
        var death_year;
    
        // console.log(element.died);

        if(element.died == '' ){

            death_year = year+1;
                       
        }
        else{
            death_year = parseInt(element.died);
        }
        
        if(year <= death_year){
            
            formatted_array2.push(element)
        }
    });

    // FORMATTED ARRAY 2 IS LIVING IN THIS YEAR

    formatted_array2.forEach(element => {
        geography.push(element.geography)
    });

    // GEOGRAPHY ARRAY NOW CONTAINS ALL THE LIVING PERSONS COUNTRY
   

    // console.log(world);
    // console.log(names);
    var list_of_country = [];
    names.forEach(element => {
        list_of_country.push(element.country)
    });
    // console.log(list_of_country)


    // svg.selectAll('path')
    //     .data(topojson.feature(world, world.objects.countries).features)
    //   .enter().append('path')
    var countries = topojson.feature(world,world.objects.ne_110m_admin_0_countries).features;
        svg
            .selectAll(".countries")
            // .selectAll("g")
            .data(countries)
            .enter()
            .append("path")
            .attr("class",function(d){

                //add the country name in class attribute so that later it can be retrieved
                
                // TREAT COUNTRIES FOR WHICH NAMES DO NOT MATCH
                // return the country name present in database
                // if(list_of_country.includes('USA'))
                //     return 'USA';


                // return d.properties.BRK_NAME; //THIS WORKS TOO
                return d.properties.NAME;
            })
            .attr("d",path)
            // .attr("fill","#abcdef") //to show the land
            // .attr("stroke","#000000") //to divide the countries
            
            .on("click",function(d){
                // console.log(this);
                var country_name = this.getAttribute("class"); //return the country name
                // console.log(country_name)

                show_personality(year,country_name);
                show_content(country_name,content,year); //HANDLE THE DISPLAY CONTENT SECTION IN ANOTHER FILE
                
            })
            .attr("id",function(d){

                var country_name = d.properties.NAME;
                 
                // TREAT COUNTRIES FOR WHICH NAMES DO NOT MATCH
                //Push to the list the name returned by map
                if(list_of_country.includes('USA'))
                    list_of_country.push('United States of America');
                if(list_of_country.includes('England'))
                    list_of_country.push('United Kingdom');
                


                if(geography.includes('USA'))
                    geography.push('United States of America');
                if(geography.includes('England'))
                    geography.push('United Kingdom');



                if(list_of_country.includes(country_name))
                    return 'country_with_history'; //SHOW COUNTRY WHERE PERSONILITY IS AVAILABLE IN RED
                if(geography.includes(country_name)) //SHOW COUNTRY WHERE PERSONILITY IS AVAILABLE IN A DIFFERENT COLOR
                    return 'country_with_person';

            })
            

       
            
    
    redraw();       // update path data
// });
        }
   

// track last translation and scale event we processed
var tlast = [0,0], 
    slast = null;

function redraw() {
    if (d3.event) { 
        var scale = d3.event.scale,
            t = d3.event.translate;                
        
        // if scaling changes, ignore translation (otherwise touch zooms are weird)
        if (scale != slast) {
            projection.scale(scale);
        } else {
            var dx = t[0]-tlast[0],
                dy = t[1]-tlast[1],
                yaw = projection.rotate()[0],
                tp = projection.translate();
        
            // use x translation to rotate based on current scale
            projection.rotate([yaw+360.*dx/width*scaleExtent[0]/scale, 0, 0]);
            // use y translation to translate projection, clamped by min/max
            var b = mercatorBounds(projection, maxlat);
            if (b[0][1] + dy > 0) dy = -b[0][1];
            else if (b[1][1] + dy < height) dy = height-b[1][1];
            projection.translate([tp[0],tp[1]+dy]);
        }
        // save last values.  resetting zoom.translate() and scale() would
        // seem equivalent but doesn't seem to work reliably?
        slast = scale;
        tlast = t;
    }
    
    svg.selectAll('path')       // re-project path data
        .attr('d', path);
}


}