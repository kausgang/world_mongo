function render_map(){

    var width = 860,
    height = 600;
    // r = 250;

// var projection = d3.geoOrthographic()
var projection = d3.geoMercator()
    .scale(150)
    .translate([width / 2, height / 2])
    // .clipAngle(100);

var path = d3.geoPath()
    .projection(projection);

// var svg = d3.select("body").append("svg")
var svg = d3.select('#globe')
    .attr("width", width)
    .attr("height", height);






//  svg.append("circle")
//         .attr("cx", width / 2).attr("cy", height / 2)
//         .attr("r", 250)
//         .style("fill", "none")
//         .attr("stroke","black")
//         .attr("stroke-width",1)
        ;



 d3.json("https://raw.githubusercontent.com/kausgang/interactive_world_map/master/ne_110m_admin_0_countries.json", function(error, world){

  if (error) throw error;



 var countries = topojson.feature(world,world.objects.ne_110m_admin_0_countries).features;

console.log(countries);



        svg
            // .selectAll(".countries")
            .selectAll("g")
            .data(countries)
            .enter()
            .append("path")
            .attr("class",function(d){

                //add the country name in class attribute so that later it can be retrieved
                
                return d.properties.BRK_NAME;
            })
            .attr("d",path)
            .attr("fill","#abcdef") //to show the land
            .attr("stroke","#000000") //to divide the countries
            
            .on("click",function(d){
                // console.log(this);
                var x = this.getAttribute("class"); //return the country name
                console.log(x)
                // alert(d3.select(this).class);
            })
            

//   svg.append("path")
//       .datum(topojson.feature(world, world.objects.land))
//       .attr("class", "land")
//       .attr("d", path);

//   borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

//   svg.append("path")
//   		.datum(borders)
//   		.attr("class", "border")
//           .attr("d", path);
          
    
          
});
}