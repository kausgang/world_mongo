$(document).ready(function () {

    // GET THE HEIGHT AND WIDTH OF THE DOCUMENT
    // http://api.jquery.com/width/
    var width = $(document).width();
    var height = $(document).height();
    var svg = d3.select('#relative_person')
                .attr("width",width-150)
                .attr("height",height)

    // THIS IS ANOTHER WAY OF CAPTURING EJS VARIABLE DATA                
    // GET THE VARIBLES PASSED TO SHOW_RELATIVE_PERSON.EJS STORED IN DATALIST ID=data_from_show_relative_person.js
    var name1 = $('#name1').val();
    var name1_born = $('#name1_born').val();
    var name1_died = $('#name1_died').val();
    var picture1 = $('#picture1').val();
    var wikipedia_url1 = $('#wikipedia_url1').val();

    var name2 = $('#name2').val();
    var name2_born = $('#name2_born').val();
    var name2_died = $('#name2_died').val();
    var picture2 = $('#picture2').val();
    var wikipedia_url2 = $('#wikipedia_url2').val();

    var age_difference = $('#age_difference').val();

    // CORRECT THE YEAR NUMBER TO PROJECT ON SCALE...MY SCALE IS 0-3000...1000 here as year 0 is the 1000th year from my scale
    var _name1_born = 1000 + parseInt(name1_born);
    var  _name1_died = 1000 + parseInt(name1_died);
    var _name2_born = 1000 + parseInt(name2_born);
    var _name2_died = 1000 + parseInt(name2_died);
    

    // console.log(name1_born);

    
    
    // APPEND THE LEFT RECTANGLE 
    var padding = $('body').css('padding'); //THIS WILL RETURN 20px
    padding = padding.substring(0,padding.length-2); //THIS WILL RETURN 20
    padding = parseInt(padding);
    
    // SET THE STARTING POSITION OF THE SCALE AT MIN(NAME1_BORN,NAME2_BORN)+10 YEARS
    var each_year = (width-150)/3000; //AS I AM DISPLAYING 3000 YEARS HISTORY


   /*
      THERE CAN BE 8 DIFFERENT POSSIBILITIES
        N=NAME B=BORN D=DIED 
    
          --------------------------------------------------------
                A        B         C             D           E
        1. ----------N1B====N1D----------N2B===========N2D-------- ==> N1B_N1D_N2B_N2D
        2. ----------N1B=====N2B-----N1D================N2D------- ==> N1B_N2B_N1D_N2D
        
 */

 

    var age_coordinates = N1B_N1D_N2B_N2D(svg,each_year,_name1_born,_name1_died,_name2_born,_name2_died) //SENDING THE TRANSFORMED YEARS
    // console.log(coordinates)
    var circle_coordinates = draw_nodes(svg,name1,picture1,wikipedia_url1,name2,picture2,wikipedia_url2)

    draw_connector(svg,age_coordinates,circle_coordinates)
    

});



function draw_connector(svg,age_coordinates,circle_coordinates){

    // https://jsfiddle.net/eliranmal/hsfxS/

    // 1ST LINE
    svg.append("line")
        .attr("x1",age_coordinates.n1x)
        .attr("y1",age_coordinates.n1y+age_coordinates.height/2)
        .attr("x2",(circle_coordinates.cx1))
        .attr("y2",(circle_coordinates.cy1 - circle_coordinates.r))
        .attr("stroke","#5184AF")
        .attr("stroke-width",2)
        .attr("stroke-linecap","round")
        .attr("stroke-dasharray","1 5")

    // 1ST LINE
    svg.append("line")
        .attr("x1",age_coordinates.n2x)
        .attr("y1",age_coordinates.n2y+age_coordinates.height/2)
        .attr("x2",(circle_coordinates.cx2))
        .attr("y2",(circle_coordinates.cy2 - circle_coordinates.r))
        .attr("stroke","#5184AF")
        .attr("stroke-width",2)
        .attr("stroke-linecap","round")
        .attr("stroke-dasharray","1 5")
        
}

function draw_nodes(svg,name1,picture1,wikipedia_url1,name2,picture2,wikipedia_url2){

    // CHECK IF ANY PICTURE IS BLANK
    if(picture1 == '')
        picture1 = "/images/no_image.jpeg";
    if(picture2 == '')
        picture2 = "/images/no_image.jpeg";

// CREATE ARRAY OF OBJECTS
var obj1 = {

    name:name1,
    picture:picture1,
    wikipedia_url:wikipedia_url1
}
var obj2 = {

    name:name2,
    picture:picture2,
    wikipedia_url:wikipedia_url2
}

//CREATE DEFS TO HOLD THE PICTURE
        svg.selectAll("g")
        .data([picture1,picture2])
        .enter()
        .append("defs")
           .append("pattern")
                .attr("id",function(d,i){
                        return "attachedImage"+i;
                    })
                    .attr("height","100%")
                    .attr("width","100%")
                    .attr("patternContentUnits","objectBoundingBox")
                .append("image")
                    .attr("xlink:href",function(d){return d})
                    .attr("width","1")
                    .attr("height","1")
                    .attr("class","person_image")
                    
            
        
        // // INCLUDE WIKIPEDIA LINK IN THE CIRCLE  
        // // https://alligator.io/svg/hyperlinks-svg/      
        svg.selectAll("g")
            .data([obj1,obj2])
            .enter()
            .append("a")
                .attr("xlink:href",function(d){
                    return d.wikipedia_url
                })
                .attr("target","_blank") //to open in new tab
            .append("circle")
            .attr("cx",function(d,i){

                return 400+600*i
            })
                .attr("cy",300)
                .attr("r",100)
                .attr("fill",function(d,i){
                    return "url(#attachedImage"+i;
                })
                .attr("class","person_circle")
                .attr("name",function(d){
                    return d.name;
                })
                //TOOLTIP DISPLAY
                // https://www.youtube.com/watch?v=wsCOif7RMBo
                .on('mouseover', function(d){

                    tooltip.style("display",null)
                })
                .on('mouseout', function(d){

                    tooltip.style("display","none")
                })
                .on('mousemove', function(d){

                    var xpos = d3.mouse(this)[0] +15; //PUSH THE POSITION OF THE TOOLTIP A TILLE TO RIGHT
                    var ypos = d3.mouse(this)[1] -55;
                    tooltip.attr("transform","translate("+xpos+","+ypos+")");
                    tooltip.select("text").text(d.name)

                })



        var tooltip = svg.append('g')
        .attr("class",tooltip)
        .style("display","none")
        tooltip.append("text")
            .attr("x",15)
            .attr("dy","1.2em")
            .attr("font-size","1.2em")
            .attr("font-weight","bold")



            var coordinates = {

                cx1:400,
                cy1:300,
                cx2:1000,
                cy2:300,
                r:100
            }

            return coordinates;
        
}

function N1B_N1D_N2B_N2D(svg,each_year,name1_born,name1_died,name2_born,name2_died){

    
    // CREATE A RECTANGLE
    svg.append("rect")
    .attr("x",0)
    .attr("y",20)
    .attr("width",function(){
        return each_year*name1_born;
        
    })
    .attr("height",15)
    .attr("rx",3)
    .attr("id","A")


    // CREATE B RECTANGLE
    svg.append("rect")
    .attr("x",each_year*name1_born) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",20)
    .attr("width",function(){
        return (name1_died - name1_born)*each_year;
    })
    .attr("height",15)
    .attr("rx",3)
    .attr("id","B")

    // CREATE C RECTANGLE
    svg.append("rect")
    .attr("x",each_year*name1_died) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",20)
    .attr("width",function(){
        return (each_year*(name2_born - name1_died));
    })
    .attr("height",15)
    .attr("rx",3)
    .attr("id","C")

     // CREATE D RECTANGLE
     svg.append("rect")
     .attr("x",each_year*name2_born) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
     .attr("y",20)
     .attr("width",function(){
         return each_year*(name2_died - name2_born);
     })
     .attr("height",15)
     .attr("rx",3)
     .attr("id","D")


    // CREATE E RECTANGLE
    svg.append("rect")
    .attr("x",each_year*(name2_died) ) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",20)
    .attr("width",function(){
        return (3000 - name2_died);
    })
    .attr("height",15)
    .attr("rx",3)
    .attr("id","E")


    // RETURN COORDINATES FOR NAME1 & NAME 2 BIRTH YEAR
    var n1x,n1y,n2x,n2y;
    n1x = each_year*name1_born;
    n1y = 20;
    n2x = each_year*name2_born;
    n2y = 20;

    var coordinates = {
        n1x:n1x,
        n1y:n1y,
        n2x:n2x,
        n2y:n2y,
        height:15
    }

    return coordinates;

}