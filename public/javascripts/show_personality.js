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
        var formatted_array = [];
        var formatted_array1 = [];
        var formatted_array2 = [];

        // FIND ALL PEOPLE BELONGING TO SAME COUNTRY
        d.forEach(element => {

            // console.log(element.geography)
            var c = element.geography;
            // console.log(c)
            if(c == "USA")
                c = 'United States of America';
                
            if(c == "England")
                c = 'United Kingdom';
            
                // if(element.geography == country_name)
            if(c == country_name){
                // console.log('pushing ' + element.name)
                formatted_array.push(element);
            }
                
        });

        
       

        // console.log(formatted_array)


       

        //GET ALL PEOPLT WHO WAS BORM BEFORE CURRENT YEAR

        formatted_array.forEach(element => {

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
 
        // console.log(formatted_array2.length)

        // SET SVG HEIGHT ACCORDING TO NUMBER OF DATA
        var number_of_person = formatted_array2.length;
        svg.attr("height",(number_of_person-1)*80 + 130) // as each circle is 80px wide and 1st circle center is at (50,2*40)
                
       





      
        var cx = 50;
        var circle_radius = 40;
        var age_thickness = 15;
        

        // INCLUDE PICTURE IN SVG
        // https://stackoverflow.com/questions/11496734/add-a-background-image-png-to-a-svg-circle-shape
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

                            if(d.picture == '')
                                return "/images/no_image.jpeg"
                        
                            return d.picture;
                       
                        
                    })
                    .attr("width","1")
                    .attr("height","1")
                    .attr("class","person_image")
                    
        // INCLUDE WIKIPEDIA LINK IN THE CIRCLE  
        // https://alligator.io/svg/hyperlinks-svg/      
        svg.selectAll("g")
            .data(formatted_array2)
            .enter()
            .append("a")
                .attr("xlink:href",function(d){
                    return d.wikipedia_url
                })
                .attr("target","_blank") //to open in new tab
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
        
                

        // SHOW THE BAR
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
                .attr("rx",5)
                .attr("ry",5)
                .attr("width",function(d){

                    var geography = d.geography;
                    // if(geography == country_name){
                        var age = (year - parseInt(d.born))*7;
                        return age; //MULTIPLYING WITH 7 SO THAT THE WIDTH TAKES UP SOME SPACE IN SVG
                    // }
                })
                .attr("height",age_thickness)
                // .attr("class","person_age")
                .attr("class",function(d){
                    
                    var death_year = parseInt(d.died);
                    if(year == death_year)
                            return "death_year";
                    return "person_age";
                })
                .on('mouseover', function(){

                    tooltip.style("display",null)
                })
                .on('mouseout', function(){

                    tooltip.style("display","none")
                })
                .on('mousemove', function(d){

                    var name = d.name;
                    var age = (year - parseInt(d.born));
                    var death_year = parseInt(d.died);
                    
                    var xpos = d3.mouse(this)[0] -15;
                    var ypos = d3.mouse(this)[1] -55;
                    tooltip.attr("transform","translate("+xpos+","+ypos+")");
                    tooltip.select("text").text(function(d){

                        if(year == death_year)
                            return name + " died in " + year;
                        
                        return name + " was " + age + " years old in " + year;
                    })

                })
                

        // IF NON PERSON ENTITY THEN ADD A CIRCLE NEXT TO THE BAR
        svg.selectAll('g')
            .data(formatted_array2)
            .enter()
            .append("circle")
                .attr("cx",function(d){
                    // console.log(d.non_person);
                    if(d.non_person){
                        // DRAW A CIRCLE JUST AT THE BEGINNING OF THE BAR
                        var rect_x = cx+circle_radius+10;
                        return rect_x;
                    }        
                })
                .attr("cy",function(d,i){
                    // console.log(d.non_person);
                    if(d.non_person){
                        // DRAW A CIRCLE JUST AT THE BEGINNING OF THE BAR
                        var cy = 2*circle_radius*i + 2*circle_radius;
                        var rect_y = cy - age_thickness/2;
                        return rect_y + age_thickness/2;
                    }        
                })
                .attr("r",function(d){
                    if(d.non_person)
                        return 10;
                })
                .attr("fill","000")
                .attr("class","non_person")
                .attr("name",function(d){
                    return d.name;
                })
                .on('mouseover', function(){

                    tooltip.style("display",null)
                })
                .on('mouseout', function(){

                    tooltip.style("display","none")
                })
                .on('mousemove', function(d){

                                    
                    var xpos = d3.mouse(this)[0] -15;
                    var ypos = d3.mouse(this)[1] -55;
                    tooltip.attr("transform","translate("+xpos+","+ypos+")");
                    tooltip.select("text").text("Not-A-Person")
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
                    // if(geography == country_name){
                        return text_x;
                    // }
                    
                })
                .attr("y",function(d,i){
                   
                    var cy = 2*circle_radius*i + 2*circle_radius;
                    var rect_y = cy - age_thickness/2;
                    var text_y = rect_y +  age_thickness/2 ;

                    var geography = d.geography;
                    // if(geography == country_name){
                        return text_y + 5; //ADDING 5 PIXELS TO POSITION THE TEXT CORRECTLY
                    // }
                })
                .text(function(d){
                    var geography = d.geography;
                    // if(geography == country_name){
                        return (year - parseInt(d.born)) 
                    // }
                    // else    
                        // return '';

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








