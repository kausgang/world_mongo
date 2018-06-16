function show_content(country_name,content,year){

    var event_country = $("#event_country");
    var text_area = $('#event'); //GET THE TEXT VIEWING AREA

    // CLEAR THE TEXT AREA FIRST
    event_country.html('');
    text_area.html('');

    event_country.html(country_name + ' in '+year+'<br><br>')

    // FIX COUNTRY NAMES THAT DO NOT MATCH RECORD IN DATABASE
    if(country_name == 'United States of America')
        country_name = 'USA';
    if(country_name == 'United Kingdom')
        country_name = 'England';

        // console.log(content[country_name]);

         // https://stackoverflow.com/questions/922544/using-variable-keys-to-access-values-in-javascript-objects?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
         // get the content from file and show here
        //  text_area.html(content[country_name]); 

    // CREATE AN UNORDERED LIST FOR THE RECORDS
    //HERE CHECK FOR UNDEFINED CONTENT ARRAY COULD BE DONE BUT HAS NOT BEEN IMPLEMENTED AS THIS DOESN'T STOP THE OPERATION
    content[country_name].forEach(element => {
        text_area.append(
            '<li class="event_list">'+element+'</li>'
            // '<li class="event_list"><a href="#">'+element+'</a></li>'
        )
            
        });

}