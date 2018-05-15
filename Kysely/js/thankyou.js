$(document).ready(function () {

    $(".kiitossivu").fadeIn(200);
});

function etusivu() {
    $("body").fadeOut(1000, function () {
    window.location.assign("index.html");
});
}

function answers() {
    $("body").fadeOut(1000, function () {
        window.location.assign("answer.html");
    });
};