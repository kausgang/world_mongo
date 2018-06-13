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
    
    var text_area = $('#event'); //GET THE TEXT VIEWING AREA
    var parameter = { year: year };
    $.get('/get_content',parameter,function(country_filename){

        // console.log(data);

        //CLEAR THE COUNTRY ARRAY FIRST
        // country = [];

        //HIGHLIGHT ALL THE COUNTRIES RETURNED BY QUERY
        // get_country_list(data);
        // console.log(country_filename);

        // $.get('/redraw_map',null,function(res){

        
        // })

        reload_map_d3(country_filename)

        // var a = country[1];
         // https://stackoverflow.com/questions/922544/using-variable-keys-to-access-values-in-javascript-objects?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
         // get the content from file and show here
        //  text_area.html(data[a]); //CHANGE INSIDE HTML()
    })

  

}


function get_country_list(data){

    // var country = [];
    Object.keys(data).forEach(function(key){
        var value = data[key];
        // console.log(key + ':####' + value);
    
        country.push(key);
        
        // return country;
    });

}






