$(document).ready(function () {

    $(".kiitossivu").fadeIn(1000);
});
function etusivu(){
    window.location.assign("index.html");
}

function answers(){
    $("body").fadeOut( 1000, function() {
        window.location.assign("answer.html");
      });
  };