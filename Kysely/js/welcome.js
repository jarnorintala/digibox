
let video = document.getElementById("backgroundVideo");
video.playbackRate = 0.5;

function fadeout(){
    $("body").fadeOut( 1000, function() {
        window.location.assign("form.html");
      });
  };

  function answers(){
    $("body").fadeOut( 1000, function() {
        window.location.assign("answer.html");
      });
  };

