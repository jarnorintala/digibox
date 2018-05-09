var lomakekentta = [];

$(document).ready(function () {
    console.log("valmista");

    $.getJSON("https://dry-scrubland-49363.herokuapp.com/kyselyt/2", function (data) {
        var items = [];

        $.each(data.kysymykset, function (key, d) {

            if (d.tyyppi == "text") {
                items.push('<div class="form-group mb-5"><label for="' + d.kysymysid + '"><span class="questionheader">' + d.kysymys + '</span></label>');

                items.push('<textarea class="form-control" id="' + d.kysymysid + '" rows="3"></textarea></div>');
                lomakekentta.push(d.kysymysid);
            }
            if (d.tyyppi == "radio") {

                if (d.vaihtoehdot.length > 3) {
                    items.push('<div class="form-group mb-5"><label for="' + d.kysymysid + '"><span class="questionheader">' + d.kysymys + '</span></label><br>');
                    for (i = 0; i < d.vaihtoehdot.length; i++) {
                        let imgURL = "";
                        if (d.vaihtoehdot[i].vaihtoehto == "Erinomainen") {
                            imgURL = "veryhappy.png";
                        }
                        if (d.vaihtoehdot[i].vaihtoehto == "Hyvä") {
                            imgURL = "happy.png";
                        }
                        if (d.vaihtoehdot[i].vaihtoehto == "Kohtalainen") {
                            imgURL = "sad.png";
                        }
                        if (d.vaihtoehdot[i].vaihtoehto == "Huono") {
                            imgURL = "shouting.png";
                        };
                        items.push('<div class="form-check form-check-inline"> <label><input class="form-check-input" type="radio" name="' + d.kysymysid + '" id="' + d.kysymysid + '" value="' + d.vaihtoehdot[i].vaihtoehto + '"><img src="' + imgURL + '"></label></div>');

                    };

                    items.push('</div>');
                    lomakekentta.push(d.kysymysid);
                } else {
                    items.push('<div class="form-group mb-5"><label for="' + d.kysymysid + '"><span class="questionheader">' + d.kysymys + '</span></label><br>');
                    for (i = 0; i < d.vaihtoehdot.length; i++) {

                        items.push('<div class="form-check form-check-inline"> <input class="form-check-input" type="radio" name="' + d.kysymysid + '" id="' + d.kysymysid + '" value="' + d.vaihtoehdot[i].vaihtoehto + '"><label class="form-check-label" for="' + d.kysymysid + '">' + d.vaihtoehdot[i].vaihtoehto + '</label></div>');

                    };
                    items.push('</div>');
                    lomakekentta.push(d.kysymysid);
                };
            };

        });

        $("<form/>", {
            id: 'kyselylomake',
            html: items.join("")
        }).appendTo("#lomake");
        $("<button/>", {
            class: 'btn btn-danger mb-5 mx-4',
            id: 'lopeta',
            type: "button",
            onclick: "etusivu()"
        }).appendTo("#kyselylomake");
        $("<button/>", {
            class: 'btn btn-success mb-5 mx-4',
            id: 'lahetysnappi',
            type: "button",
            onclick: "laheta()"
        }).appendTo("#kyselylomake");
        
        document.getElementById("lahetysnappi").innerText = 'Lähetä';
        document.getElementById("lopeta").innerText = 'Peruuta';
        $(".loader").fadeOut(500, function() {
            $( "#lomake" ).fadeIn(2000);
          });
    });

});

function laheta() {
    var vastaus;
    var lahetys = [];
    for (i = 0; i < lomakekentta.length; i++) {

        tyyppi = document.getElementById(lomakekentta[i]).type;

        if (tyyppi == "textarea") {
            vastaus = document.getElementById(lomakekentta[i]).value;

        }

        if (tyyppi == "radio") {
            var radios = document.getElementsByName(lomakekentta[i]);
            var length = radios.length;
            for (x = 0; x < length; x++) {
                if (radios[x].checked) {
                    vastaus = radios[x].value;
                    break;
                }
            }
        }

        lahetys.push("{\"vastaus\":\"" + vastaus + "\", \"kysymys\":{\"kysymysid\":\"" + lomakekentta[i] + "\"}}");
        vastaus = "";

    }

    let status = true;
    let error = "";
    for (let i = 0; i < lahetys.length; i++) {
        const answer = lahetys[i];
        $.ajax({
            url: 'https://dry-scrubland-49363.herokuapp.com/addvastaus',
            crossDomain: 'true',
            type: 'POST',
            dataType: 'json',
            headers: {

                "Content-Type": "application/json"
            },
            data: answer,
            error: function (xhr, textStatus, errorThrown) {
                status = false;
                error = xhr.status;
            }
        });
    };
    if (status === true) {
        console.log(lahetys);
        document.getElementById("kyselylomake").reset();
        window.location.assign("thankyou.html");
    } else {
        alert("Lomakkeen lähettäminen epäonnistui!\nKokeile myöhemmin uudelleen.\nVirhekoodi: " + error);
        
    }
};

function etusivu(){
    window.location.assign("index.html");
}