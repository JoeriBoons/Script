//Written by hardcode
(function() {
    var show = true;
    var head = $(".vis:contains('Aankomend')", content_value).find("tr:first");
    var text = $("th:contains('Aankomst:')", content_value).html('Aankomend: <img src="https://nlp1.tribalwars.nl/graphic/minus.png" style=" float: right;">');

    head.on("click", function () {
        if(show === true) {
            $(".no_ignored_command").hide();
            text.html('Verborgen: <img src="https://nlp1.tribalwars.nl/graphic/plus.png" style=" float: right;">');
            show = false;
        }else{
            $(".no_ignored_command").show();
            text.html('Aankomend: <img src="https://nlp1.tribalwars.nl/graphic/minus.png" style=" float: right;">');
            show = true;
        }
    });
}());