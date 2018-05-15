let kysymykset = [];
let answers = [];
let requests = 0;

$(document).ready(function () {
    console.log("valmista");

    //haetaan alkuperäiset kysymykset

    $.getJSON("https://dry-scrubland-49363.herokuapp.com/kyselyt/2", function (data) {

        $.each(data.kysymykset, function (key, d) {

            //luodaan kysymys objekti, joka työnnetään kysymykset tauluun ( kysymys id, tyyppi ja itse kysymyksen teksti ja vaihtoehdot kysymykseen)
            const kysymys = {};

            kysymys["kysymysid"] = d.kysymysid;
            kysymys["kysymys"] = d.kysymys;
            kysymys["tyyppi"] = d.tyyppi;
            kysymys["vastaus"] = [];
            kysymys["vaihtoehdot"] = [];
            for (let i = 0; i < d.vaihtoehdot.length; i++) {
                let vaihtoehto = d.vaihtoehdot[i];
                vaihtoehto["vastaustenmaara"] = 0; //tämän avulla pidetään kirjaa vastausten määrästä -> käytetään apuna generateAnswers funktiossa
                kysymys.vaihtoehdot.push(vaihtoehto);

            }

            kysymykset.push(kysymys);

        });
        console.log(kysymykset);

        // loopataan kysymysten määrä läpi ja luodaan jokaisen kysymyksen vastauksille URL, josta JSON -data haetaan

        for (let i = 0; i < kysymykset.length; i++) {
            requests++;
            console.log(requests);


            const kysymysid = kysymykset[i].kysymysid;
            const kysymys = kysymykset[i].kysymys;
            const tyyppi = kysymykset[i].tyyppi;

            const URL = "https://dry-scrubland-49363.herokuapp.com/kysymykset/" + kysymysid + "/vastaukset";

            $.getJSON(URL, function (data) {

                $.each(data, function (key, d) {

                    //luodaan vastaus objekti joka sisältää kysymyksen vastaukset yms, joka työnnetään vastauksiin

                    const vastaus = {};

                    vastaus["kysymysid"] = kysymysid;
                    vastaus["vastaus"] = d.vastaus;
                    vastaus["kysymys"] = kysymys;
                    vastaus["tyyppi"] = tyyppi;

                    answers.push(vastaus);
                    console.log(requests);

                })

                // pidetään huoli että kaikki pyynnöt käsitelty, jonka jälkeen lasketaan radio-inputtien vastausten määrät kullekin vaihtoehdolle

                requests--;
                if (requests == 0) {
                    console.log(answers);
                    generateAnswers();
                }
            });
        };

    });

})

// laskee radio-inputtien vastausten määrän kullekin vaihdoehdolle ja lisää tekstikentän vastauksen arvon kysymykset tauluun

function generateAnswers() {


    for (let i = 0; i < answers.length; i++) {

        const answer = answers[i].vastaus;
        const answerId = answers[i].kysymysid;
        const tyyppi = answers[i].tyyppi;


        if (tyyppi == "radio") {


            for (let k = 0; k < kysymykset.length; k++) {


                if (kysymykset[k].kysymysid == answerId) {

                    // kasvatetaan vastausten määrää mikäli kysymysten id ja vastaus täsmää

                    kysymykset[k].vaihtoehdot.forEach(vaihtoehto => {

                        if (vaihtoehto.vaihtoehto == answer) {

                            vaihtoehto.vastaustenmaara++;
                        }
                    });

                }


            }

        }

        if (tyyppi == "text") {

            for (let k = 0; k < kysymykset.length; k++) {


                if (kysymykset[k].kysymysid == answerId) {


                    kysymykset[k].vastaus.push(answer);

                }


            }

        }

    }


    console.log(kysymykset);
    createCharts();
}


//tuodaan vastaukset näkyviin plot.ly:llä tai tekstinä

function createCharts() {

    for (let i = 0; i < kysymykset.length; i++) {
        const kysymys = kysymykset[i];
        const kysymysteksti = kysymys.kysymys;
        const kysymysid = String(kysymys.kysymysid);


        if (kysymys.tyyppi == "radio") {

            var data = [{
                x: [],
                y: [],
                type: 'bar'
            }];



            for (let k = 0; k < kysymys.vaihtoehdot.length; k++) {

                data[0].x.push(kysymys.vaihtoehdot[k].vaihtoehto);
                data[0].y.push(kysymys.vaihtoehdot[k].vastaustenmaara);

            }
            const otsikko = [];
            otsikko.push("Vastaukset kysymykseen: " + kysymys.kysymys);
            $("<h3/>", {
                id: "otsikko" + kysymysid,
                class: "m-5 vastausotsikko",
                html: otsikko.join("")
            }).appendTo("#charts");

            $("<div/>", {
                id: kysymysid,
                class: "m-5"
            }).appendTo("#charts");

            Plotly.newPlot(kysymysid, data);
        }

        if (kysymys.tyyppi == "text") {
            let kaikkiVastaukset = "";
            let vastauksenNumero = 0;
            for (let i = 0; i < kysymys.vastaus.length; i++) {
                vastauksenNumero++;
                kaikkiVastaukset += "<p><span class='vastaus'>" + vastauksenNumero + ". vastaus:</span><span class='vastausteksti'> " + kysymys.vastaus[i] + "</span></p>";
            }

            const otsikko = [];
            otsikko.push("Vastaukset kysymykseen: " + kysymys.kysymys);

            $("<h3/>", {
                id: "otsikko" + kysymysid,
                class: "m-5 vastausotsikko",
                html: otsikko.join("")
            }).appendTo("#charts");

            $("<div/>", {
                id: kysymysid,
                class: "m-5",
                html: kaikkiVastaukset
            }).appendTo("#charts");


        }

    }
    $("<button/>", {
        id: "etusivulle",
        type: "button",
        class: "btn btn-success m-4",
        onclick: "etusivu()"
    }).appendTo("#charts");
    document.getElementById("etusivulle").innerText = 'Palaa Etusivulle';

    console.log("viety html:ään");
    fadeIn();

}

function fadeIn() {

    $(".loader").fadeOut(500, function () {
        $(".vastaussivu").fadeIn(2000);

    });
    console.log("Näytetään vastaussivu!");
}

function etusivu() {
    window.location.assign("index.html");
}