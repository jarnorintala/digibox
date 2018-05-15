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
            kysymys["vaihtoehdot"] = [];
            for (let i = 0; i < d.vaihtoehdot.length; i++) {
                let vaihtoehto = d.vaihtoehdot[i];
                vaihtoehto["vastaustenmaara"] = 0; //tämän avulla pidetään kirjaa vastausten määrästä, jonka alculateRadioAnswers() funktio antaa
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
                    calculateRadioAnswers();
                }
            });
        };

    });

})

// laskee radio-inputtien vastausten määrän kullekin vaihdoehdolle

function calculateRadioAnswers() {


    for (let i = 0; i < answers.length; i++) {

        const answer = answers[i].vastaus;
        const answerId = answers[i].kysymysid;
        const tyyppi = answers[i].tyyppi;


        if (tyyppi == "radio") {

            let answerAmount = 0;

            for (let k = 0; k < kysymykset.length; k++) {


                if (kysymykset[k].kysymysid == answerId) {

                    // kasvatetaan vastausten määrää mikäli kysymysten id ja vastaus täsmää

                    kysymykset[k].vaihtoehdot.forEach(vaihtoehto => {

                        if (vaihtoehto.vaihtoehto == answer) {

                            vaihtoehto.vastaustenmaara += 1;
                        }
                    });

                }


            }

        }

    }
    console.log(kysymykset);
    fadeIn();
}



function fadeIn() {

    $(".loader").fadeOut(500, function () {
        $(".vastaussivu").fadeIn(2000);
        printGraphs();
    });
    console.log("printataan!");
}