var country = [];

$(document).ready(function () {

   
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
         
            
            //get the year and
            var year = $('#year').val();
            //move the cursor
            slider.value = year;
            //display the year
            display_year(year);


        };
    });
    


});

//get the year when button is clicked
function on_year(){
    var year = $('#year').val();
    display_year(year);
}






function display_year(year){
    
    
    var parameter = { year: year };
    $.get('/get_content',parameter,function(obj){

        // console.log(data);

        //CLEAR THE COUNTRY ARRAY FIRST
        // country = [];

        //HIGHLIGHT ALL THE COUNTRIES RETURNED BY QUERY
        // get_country_list(data);
        // console.log(country_filename);

        // $.get('/redraw_map',null,function(res){

        
        // })

        var file_present = obj.file_present;
        var country_filename = obj.csv_filename;
        var content = obj.content;

        console.log(obj);
        if(file_present){
            
            reload_map_d3(country_filename,content,year)
        }          
        else{
            
             alert(' data not found for the year '+year);
        }
            

        
    })

  

}


function next_year(){

    //get the year from input box
    var year = parseInt($('#year').val())+1;

    // increment the year in input box
    $('#year').val(year);

    
    //call display of the new year
    display_year(year);

}


function previous_year(){

    //get the year from input box
    var year = parseInt($('#year').val())-1;

    // increment the year in input box
    $('#year').val(year);

    
    //call display of the new year
    display_year(year);

}



