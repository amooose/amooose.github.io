var music;
// JQuery - hide button upon click
// Play music+effect upon click.
$('#jiggy').click(function(){
    $(this).prop( "disabled", true );
    $(this).hide( "scale", {percent: 0}, 2000 );
    $(this).animate({'top': '-=90px'},'slow');
    
    var fadeInAudio  = new Audio();
    fadeInAudio  = new Audio();
    var srcFade  = document.createElement("source");
    srcFade.type = "audio/mpeg";
    srcFade.src  = "audio/fadeIn.mp3";
    fadeInAudio.appendChild(srcFade);
    fadeInAudio.play();

    music = new Audio();
    var src3 = document.createElement("source");
    src3.type = "audio/mpeg";
    src3.src = "audio/music.mp3";
    music.appendChild(src3);
    music.volume = 0.5;
    music.play();
    
    $("html body").animate({ backgroundColor: "#000000" }, 5000);
    $("#cheato3DCanvas").animate({ opacity: 1 }, 5000);

});
