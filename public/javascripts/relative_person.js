$(document).ready(function () {

    // GET THE HEIGHT AND WIDTH OF THE DOCUMENT
    // http://api.jquery.com/width/
    var width = $(document).width();
    var height = $(document).height();
    var svg = d3.select('#relative_person')
                // .attr("width",width -150)
                .attr("width",width -120)
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
    show_age_difference(svg,name1,name2,age_difference);

    // CORRECT THE YEAR NUMBER TO PROJECT ON SCALE...MY SCALE IS 0-3000...1000 here as year 0 is the 1000th year from my scale
    var _name1_born = 1000 + parseInt(name1_born);
    var  _name1_died = 1000 + parseInt(name1_died);
    var _name2_born = 1000 + parseInt(name2_born);
    var _name2_died = 1000 + parseInt(name2_died);
    

    // console.log(name1_born);

    
    
    // SET THE STARTING POSITION OF THE SCALE AT MIN(NAME1_BORN,NAME2_BORN)+10 YEARS
    var each_year = (width-150)/3000; //AS I AM DISPLAYING 3000 YEARS HISTORY


   /*
    
        N=NAME B=BORN D=DIED 
    
        #####################################################################################
               A        B         C             D           E     ==> CSS FOR A=C=E
        . ----------N1B====N1D----------N2B===========N2D-------- ==> N1B_N1D_N2B_N2D
        #####################################################################################
        
        
 */

    // DRAW THE SCALE
    scale_label(svg,each_year)

    // DRAW THE NODES
    var circle_coordinates = draw_nodes(svg,name1,name1_born,name1_died,picture1,wikipedia_url1,name2,name2_born,name2_died,picture2,wikipedia_url2)

    
    // DRAW TIMELINE
    var age_coordinates = draw_timeline(svg,each_year,_name1_born,_name1_died,_name2_born,_name2_died) //SENDING THE TRANSFORMED YEARS
   
    // DRAW CONNECTOR
    draw_connector(svg,age_coordinates,circle_coordinates)
    

});




function show_age_difference(svg,name1,name2,age_difference){

    svg.append("text")
        .attr("x",450)
        .attr("y",600)
        .attr("class","age_difference")
        .text(name1 + " and " + name2 + " were  (" + age_difference + ") years apart.")
}


function scale_label(svg,each_year){

    var tick1_y1=35,tick1_y2=10, text1_y=7;

    
 
    // MARK EVERY 500 YEARS
    
for(var i=0;i<=7;i++){

    // DRAW 1000bc 500bc 0 500 1000 1500 2000
    svg.append("line")
        .attr("x1",(i*500)*each_year)
        .attr("y1",tick1_y1)
        .attr("x2",(i*500)*each_year)
        .attr("y2",tick1_y2)
        .attr("stroke","#000")
        .attr("stroke-width",function(){
            if(i==2) //on 0th year , make the tick thick
                return 3
            return 1;
        })

    svg.append("text")
        .attr("x",(i*500)*each_year)
        .attr("y",text1_y)
        .attr("fill","#000")
        .attr("class","year_scale")
        .text(function(){

            if(i==0) return "1000 BC";
            if(i==1) return "500 BC";
            if(i==2) return "0";
            if(i==3) return "500";
            if(i==4) return "1000";
            if(i==5) return "1500";
            if(i==6) return "2000";

        })
            

}


    
// FOR 1500 TO 1900
for(var i=1;i<=4;i++){

    svg.append("line")
        .attr("x1",(2500+i*100)*each_year)
        .attr("y1",tick1_y1)
        .attr("x2",(2500+i*100)*each_year)
        .attr("y2",tick1_y2)
        .attr("stroke","#000")
        .attr("stroke-width",1)
        
    svg.append("text")
        .attr("x",(2500+i*100)*each_year)
        .attr("y",text1_y)
        .attr("fill","#000")
        .attr("class","year_scale")
        .text(function(){

            if(i==1) return "1600";
            if(i==2) return "1700";
            if(i==3) return "1800";
            if(i==4) return "1900";
           

        })
}
        

}


function draw_nodes(svg,name1,name1_born,name1_died,picture1,wikipedia_url1,name2,name2_born,name2_died,picture2,wikipedia_url2){

    var cx = 400,cy = 400,r=100,circle_seperation = 600;
    // CHECK IF ANY PICTURE IS BLANK
    if(picture1 == '')
        picture1 = "/images/no_image.jpeg";
    if(picture2 == '')
        picture2 = "/images/no_image.jpeg";

// CREATE ARRAY OF OBJECTS
var obj1 = {

    name:name1,
    born:name1_born,
    died:name1_died,
    picture:picture1,
    wikipedia_url:wikipedia_url1
}
var obj2 = {

    name:name2,
    born:name2_born,
    died:name2_died,
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

                return cx+circle_seperation*i
            })
                .attr("cy",cy)
                .attr("r",100)
                .attr("fill",function(d,i){
                    return "url(#attachedImage"+i;
                })
                // .attr("class","person_circle")
                .attr("class",function(d,i){
                    return "person_circle"+i;
                })
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
                    tooltip.select("text").text(d.name + " from "+ d.born + " to " + d.died)

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

                cx1:cx,
                cy1:cy,
                cx2:cx+circle_seperation,
                cy2:cy,
                r:r
            }

            return coordinates;
        
}


function draw_connector(svg,age_coordinates,circle_coordinates){

    // https://jsfiddle.net/eliranmal/hsfxS/

    // 1ST LINE
    svg.append("line")
        .attr("x1",age_coordinates.n1x)
        .attr("y1",age_coordinates.n1y+age_coordinates.height/2)
        .attr("x2",(circle_coordinates.cx1))
        .attr("y2",(circle_coordinates.cy1 - circle_coordinates.r))
        .attr("stroke","red")
        .attr("stroke-width",2)
        .attr("stroke-linecap","round")
        .attr("stroke-dasharray","1 5")

    // 1ST LINE
    svg.append("line")
        .attr("x1",age_coordinates.n2x)
        .attr("y1",age_coordinates.n2y+age_coordinates.height/2)
        .attr("x2",(circle_coordinates.cx2))
        .attr("y2",(circle_coordinates.cy2 - circle_coordinates.r))
        .attr("stroke","blue")
        .attr("stroke-width",2)
        .attr("stroke-linecap","round")
        .attr("stroke-dasharray","1 5")
        
}







function draw_timeline(svg,each_year,name1_born,name1_died,name2_born,name2_died){

    var x_start=0,y_start=20,height=15;
    var n1_b_tick_y2 = 50,n1_d_tick_y2 = 80;
    var n2_b_tick_y2 = 110,n2_d_tick_y2 = 140;

    // CREATE A RECTANGLE
    svg.append("rect")
    .attr("x",x_start)
    .attr("y",y_start)
    .attr("width",function(){
        return each_year*name1_born;
        
    })
    .attr("height",height)
    .attr("rx",3)
    .attr("id","A")


    // CREATE B RECTANGLE
    svg.append("rect")
    .attr("x",each_year*name1_born) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",y_start)
    .attr("width",function(){
        return (name1_died - name1_born)*each_year;
    })
    .attr("height",height)
    .attr("rx",3)
    .attr("id","B")

    // CREATE C RECTANGLE
    svg.append("rect")
    .attr("x",each_year*name1_died) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",y_start)
    .attr("width",function(){
        return (each_year*(name2_born - name1_died));
    })
    .attr("height",height)
    .attr("rx",3)
    .attr("id","A")

     // CREATE D RECTANGLE
     svg.append("rect")
     .attr("x",each_year*name2_born) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
     .attr("y",y_start)
     .attr("width",function(){
         return each_year*(name2_died - name2_born);
     })
     .attr("height",height)
     .attr("rx",3)
     .attr("id","D")


    // CREATE E RECTANGLE
    svg.append("rect")
    .attr("x",each_year*(name2_died) ) //START FROM THE LAST POINT OF PREVIOUS RECTABGLE
    .attr("y",y_start)
    .attr("width",function(){
        return (3000 - name2_died);
    })
    .attr("height",height)
    .attr("rx",3)
    .attr("id","A")


    
    // DRAW THE LINES INDICATING BIRTH AND DEATH YEAR AT 4 LEVELS FOR 2 PERSON
    // LEVEL1 - NAME1 BORN
    svg.append("line")
        .attr("x1",(each_year*name1_born))
        .attr("y1",y_start)
        .attr("x2",(each_year*name1_born))
        .attr("y2",n1_b_tick_y2)
        .attr("stroke","#000")
        .attr("stroke-width",1)
    // LEVE2 - NAME1 DIED
    svg.append("line")
        .attr("x1",(each_year*name1_died))
        .attr("y1",y_start)
        .attr("x2",(each_year*name1_died))
        .attr("y2",n1_d_tick_y2)
        .attr("stroke","#000")
        .attr("stroke-width",1)
    // LEVEL3 - NAME2 BORN
    svg.append("line")
        .attr("x1",(each_year*name2_born))
        .attr("y1",y_start)
        .attr("x2",(each_year*name2_born))
        .attr("y2",n2_b_tick_y2)
        .attr("stroke","#000")
        .attr("stroke-width",1)
    // LEVEL4 - NAME2 BORN
    svg.append("line")
        .attr("x1",(each_year*name2_died))
        .attr("y1",y_start)
        .attr("x2",(each_year*name2_died))
        .attr("y2",n2_d_tick_y2)
        .attr("stroke","#000")
        .attr("stroke-width",1)

    // PUT LABEL ON THE BIRTH AND DEATH YEAR
    // LEVEL1 - NAME1 BORN
    svg.append("text")
        .attr("x",(each_year*name1_born)-10)
        .attr("y",n1_b_tick_y2+12)
        .attr("fill","#000")
        .attr("class","year_name1")
        .text(function(){
            var birth = parseInt(name1_born) - 1000;
            return birth;
        })
    // LEVEL2 - NAME1 BORN
    svg.append("text")
        .attr("x",(each_year*name1_died)-10)
        .attr("y",n1_d_tick_y2+12)
        .attr("fill","#000")
        .attr("class","year_name1")
        .text(function(){
            var death = parseInt(name1_died) - 1000;
            return death;
        })
    // LEVEL3 - NAME2 BORN
    svg.append("text")
        .attr("x",(each_year*name2_born)-10)
        .attr("y",n2_b_tick_y2+12)
        .attr("fill","#000")
        .attr("class","year_name2")
        .text(function(){
            var birth = parseInt(name2_born) - 1000;
            return birth;
        })
    // LEVEL2 - NAME1 BORN
    svg.append("text")
        .attr("x",(each_year*name2_died)-10)
        .attr("y",n2_d_tick_y2+12)
        .attr("fill","#000")
        .attr("class","year_name2")
        .text(function(){
            var death = parseInt(name2_died) - 1000;
            return death;
        })





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






