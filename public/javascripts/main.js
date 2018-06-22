var country = [];

$(document).ready(function () {

//    DRAW SCALE
    draw_scale();


    var slider = document.getElementById("myRange");
    var output = document.getElementById("year");
    output.value = slider.value;
    
    // LOAD THE GLOBE FIRST
    // render_globe();
    // LOAD THE INTERACTIVE MAP
    render_map();
    

    // MOVE THE SLIDER AND ADJUST YEAR IN INPUT BOX
    slider.oninput = function() {
    //   output.innerHTML = this.value;
    output.value=this.value;
    }


    //move the slider if year is manually entered
    $('#year').on('keyup', function(e){

        if(e.keyCode === 13) {
         
            //CLEAR THE CONTENT OF EVENTS AND PERSONALITY
            $('#event_country').html('');
            $('#event').html('');
            $('#personality').html('');
            
            //get the year and
            var year = $('#year').val();
            //move the slider
            slider.value = year;
            //display the year
            display_year(year);


        };
    });
    


});

//get the year when button is clicked
function on_year(){

     //CLEAR THE CONTENT OF EVENTS AND PERSONALITY
     $('#event_country').html('');
     $('#event').html('');
     $('#personality').html('');
    var year = $('#year').val();
    //move the slider
    $('#myRange').val(year)

    display_year(year);
}






function display_year(year){
    
    
    var parameter = { year: year };
    $.get('/get_content',parameter,function(obj){

        // console.log(data);

       
       

        var file_present = obj.file_present;
        var country_filename = obj.csv_filename;
        var content = obj.content;

        // console.log(obj);
        if(file_present){
            
            reload_map_d3(country_filename,content,year)
        }          
        else{
            
            //  alert('Country History '+year);
             reload_map_d3(country_filename,content,year);
             display_year(year);
            
        }
            

        
    })

  

}


function next_year(){

    //CLEAR THE CONTENT OF EVENTS AND PERSONALITY
    $('#event_country').html('');
    $('#event').html('');
    $('#personality').html('');

    //get the year from input box
    var year = parseInt($('#year').val())+1;

    // increment the year in input box
    $('#year').val(year);

    
    //call display of the new year
    display_year(year);

}


function previous_year(){

    //CLEAR THE CONTENT OF EVENTS AND PERSONALITY
    $('#event_country').html('');
    $('#event').html('');
    $('#personality').html('');
    
    //get the year from input box
    var year = parseInt($('#year').val())-1;

    // increment the year in input box
    $('#year').val(year);

    
    //call display of the new year
    display_year(year);

}



function draw_scale(){

 
    var width = $('#myRange').width();
    var svg = d3.select('#scale')
                .attr("width",width+10)
                .attr("height",16)
    var year_range = 3050;
    var each_year = width/year_range;
    scale_label(svg,each_year);

}


function scale_label(svg,each_year){

    var tick1_y1=16,tick1_y2=9, text1_y=8;

    // LINE
    svg.append("line")
        .attr("x1",0)
        .attr("y1",16)
        .attr("x2",each_year*3050)
        .attr("y2",16)
        .attr("stroke","#000")
        .attr("stroke-width","0.5")

 
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


    
      

}