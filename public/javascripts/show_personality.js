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
        
            console.log(element.died);

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
 




        /* svg.selectAll('.picture')
            .data(formatted_array2)
            .enter()
            .append("defs")
            .append("clipPath")
                .attr("id","myCircle")
            .append("circle")
                .attr("cx","30")
                .attr("cy",function(d,i){      //A WAY TO INCLUDE SERIAL DATA I
                    return 10+i*20; //MODIFY THIS (I*X) TO CHANGE THE DISTANCE BETWEEN EACH BAR
                })
                .attr("r","30")
                .attr("fill","#FFFFFF")
                .attr("stroke","#000000")
            


        svg.selectAll('.picture')
            .data(formatted_array2)
            .enter()
            .append("image")
                .attr("clip-path","url(#myCircle)")
                .attr("xlink:",function(d){

                    return d.picture;
                })




    //    DRAW BARS
        svg
            .selectAll(".bar")
            // .append("g")
            // .data(age)
            .data(formatted_array2)
            .enter()
            .append("rect")
            .attr("x","30")
            .attr("y",function(d,i){      //A WAY TO INCLUDE SERIAL DATA I
                
               
                return 10+i*20; //MODIFY THIS (I*X) TO CHANGE THE DISTANCE BETWEEN EACH BAR
            })
            .attr("height", "10")   //MODIFY THIS TO CHANGE THE THICKNESS OF EACH BAR
            .attr("width", function(d){
               
                // CHECK FOR COOUNTRY
                var geography = d.geography;

                if(geography == country_name){

                    return (year - parseInt(d.born))*7; //MULTIPLYING WITH 7 SO THAT THE WIDTH TAKES UP SOME SPACE IN SVG
                    
                }
               
            })
            .attr("class","bar")
            .attr("id",function(d){

                return d.wikipedia_url;
            })
            .attr("age",function(d){
                return year - parseInt(d.born) + 1
            })
            
       
        //SET THE AGE NUMBER AT TOP OF EACH BAR
        svg.selectAll('.bar_value')
            .data(formatted_array2)
            .enter()
            .append("text")
            // .attr("text-anchor", "middle")
            .attr("x", function(d) { return (year - parseInt(d.born))*7 +32; })
            .attr("y", function(d,i) { return 20+i*20; })
            .text(function(d) { 
                
                var geography = d.geography;
                if(geography == country_name){
                    return year - parseInt(d.born) + 1
                }
                else    
                    return '';
                
                
             });

 */


// var tip = d3.tip()
// .attr('class', 'd3-tip')
// .offset([-10, 0])
// .html(function(d) {
//     var age = (year - parseInt(d.born));
//     return "<strong>Age:</strong> <span style='color:red'>" + age + "</span>";
// })


      
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
                // .on('mouseover', tip.show)
                // .on('mouseout', tip.hide)

                


        

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
                        return text_y;
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






    })





    

}