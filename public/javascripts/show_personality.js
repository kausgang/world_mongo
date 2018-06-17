function show_personality(year,country_name){

    
    var width = 860,
    height = 500;

    var svg = d3.select('#personality')
        .attr("width", width)
        .attr("height", height);
        
    // CLEAR OUT THE PREVIOUS CONTENT FIRST
    // https://stackoverflow.com/questions/10784018/how-can-i-remove-or-replace-svg-content
    svg.selectAll("*").remove();




    





    
    d3.csv('/PERSONALITY/personality.csv',function(d){




  


        // FORMAT THE INPUT TO SELECT ONLY THE LIVING PERSONALITIES 
        // REMOVE ALL THE DATA THAT IS NOT LIVING IN CURRENT YEAR
        var formatted_array1 = [];
        var formatted_array2 = [];
        //GET ALL PEOPLT WHO WAS BORM BEFORE CURRENT YEAR
        d.forEach(element => {

            var birth_year = parseInt(element.born);
           
            if(birth_year <= year){ //all the people was born before this year

                formatted_array1.push(element); 
            }
            
        });
        
        
        // OUT OF THE PEOPLE BORN BEFORE CURRENT YEAR, SELECT ALL THAT DIED BEFORE CURRENT YEAR
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
        


        // SORT THE ARRAY FROM BIGGER AGE TO LOWER AGE
        // https://www.w3schools.com/js/js_array_sort.asp
        formatted_array2.sort(function(a,b){

            return parseInt(a.born) - parseInt(b.born)
        })
 



        
       





      
        var cx = 50;
        var circle_radius = 40;
        var age_thickness = 15;
        

        
        svg.selectAll("g")
            .data(formatted_array2)
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
                    .attr("xlink:href",function(d){

                        var geography = d.geography;
                        if(geography == country_name){
                            return d.picture;
                        }
                        
                    })
                    .attr("width","1")
                    .attr("height","1")
                    .attr("class","person_image")
                    


        svg.selectAll("g")
            .data(formatted_array2)
            .enter()
            .append("circle")
                .attr("cx",cx)
                .attr("cy",function(d,i){

                    var cy = 2*circle_radius*i + 2*circle_radius;
                    return cy;
                })
                .attr("r",circle_radius)
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
               
                //THIS IS ANOTHER WAY OF SHOWING TOOLTIP, BUT LESS EFFICIENT
                // .append("svg:title")
                // .text(function(d, i) { 
                //     // return "My color is " + colors(i); 
                //     return d.name;
                // });
        
                


        svg.selectAll("g")
            .data(formatted_array2)
            .enter()
            .append("rect")
                .attr("x",function(d,i){
                    var rect_x = cx+circle_radius+10;
                    return rect_x;
                })
                .attr("y",function(d,i){

                    var cy = 2*circle_radius*i + 2*circle_radius;
                    var rect_y = cy - age_thickness/2;
                    return rect_y;
                })
                .attr("width",function(d){

                    var geography = d.geography;
                    if(geography == country_name){
                        var age = (year - parseInt(d.born))*7;
                        return age; //MULTIPLYING WITH 7 SO THAT THE WIDTH TAKES UP SOME SPACE IN SVG
                    }
                })
                .attr("height",age_thickness)
                .attr("class","person_age")
                .on('mouseover', function(){

                    tooltip.style("display",null)
                })
                .on('mouseout', function(){

                    tooltip.style("display","none")
                })
                .on('mousemove', function(d){

                    var name = d.name;
                    var age = (year - parseInt(d.born));
                    
                    var xpos = d3.mouse(this)[0] -15;
                    var ypos = d3.mouse(this)[1] -55;
                    tooltip.attr("transform","translate("+xpos+","+ypos+")");
                    tooltip.select("text").text(function(d){

                        
                        
                        return name + " was " + age + " years old in " + year;
                    })

                })
                

                


        

        svg.selectAll("g")
            .data(formatted_array2)
            .enter()
            .append("text")
                .attr("x",function(d,i){
                    var rect_x = cx + circle_radius+10;
                    var age = (year - parseInt(d.born))*7;
                    var text_x = rect_x + age + 10 ;

                    var geography = d.geography;
                    if(geography == country_name){
                        return text_x;
                    }
                    
                })
                .attr("y",function(d,i){
                   
                    var cy = 2*circle_radius*i + 2*circle_radius;
                    var rect_y = cy - age_thickness/2;
                    var text_y = rect_y +  age_thickness/2 ;

                    var geography = d.geography;
                    if(geography == country_name){
                        return text_y + 5; //ADDING 5 PIXELS TO POSITION THE TEXT CORRECTLY
                    }
                })
                .text(function(d){
                    var geography = d.geography;
                    if(geography == country_name){
                        return (year - parseInt(d.born)) 
                    }
                    else    
                        return '';

                })
                .attr("class","person_age_number")



                //REMEMBER TO PLACE THE TOOLTIP VARIABLE IN THE END, 
                // IF YOU PLACE IT RIGHT AFTER THE CIRCLE (WHERE IS IT USED FIRST), THE AGE BAR WILL NOT BE SHOWN
                var tooltip = svg.append('g')
                .attr("class",tooltip)
                .style("display","none")
                tooltip.append("text")
                    .attr("x",15)
                    .attr("dy","1.2em")
                    .attr("font-size","1.2em")
                    .attr("font-weight","bold")
               


    })






    

}








// function showTooltip(evt, text) {
//     let tooltip = document.getElementById("tooltip");
//     tooltip.innerHTML = text;
//     tooltip.style.display = "block";
//     tooltip.style.left = evt.pageX + 10 + 'px';
//     tooltip.style.top = evt.pageY + 10 + 'px';
//   }
  
//   function hideTooltip() {
//     var tooltip = document.getElementById("tooltip");
//     tooltip.style.display = "none";
//   }