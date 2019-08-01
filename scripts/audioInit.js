// Init audio
var pokeAudio = new Audio();
var flapAudio = new Audio();
var bounceA = new Audio();
var pull = new Audio();
var voiceAudio = new Audio();
var bubbleOut = new Audio();
var bubbleClose = new Audio();
var snackerMusic = new Audio();
var snackerVoice = new Audio();

//Wait until click due to Chrome's media autoplay policy
document.querySelector('#jiggy').addEventListener('click', function() {
    snackerVoice = new Audio();
    var snackerVSrc = document.createElement("source");
    snackerVSrc.type = "audio/mpeg";
    snackerVSrc.src = "audio/snackerVoice.mp3";
    snackerVoice.appendChild(snackerVSrc);

    snackerMusic = new Audio();
    var snackerMSrc = document.createElement("source");
    snackerMSrc.type = "audio/mpeg";
    snackerMSrc.src = "audio/snackerMusic.mp3";
    snackerMusic.appendChild(snackerMSrc);
    snackerMusic.volume = 0.0;
    snackerMusic.loop = true;

    flapAudio = new Audio();
    var flapSrc = document.createElement("source");
    flapSrc.type = "audio/mpeg";
    flapSrc.src = "audio/flapclose.mp3";
    flapAudio.appendChild(flapSrc);

    pokeAudio = new Audio();
    var pokeSrc = document.createElement("source");
    pokeSrc.type = "audio/mpeg";
    pokeSrc.src = "audio/poke.mp3";
    pokeAudio.appendChild(pokeSrc);

    bounceA = new Audio();
    var bounceSrc = document.createElement("source");
    bounceSrc.type = "audio/mpeg";
    bounceSrc.src = "audio/bounce.mp3";
    bounceA.appendChild(bounceSrc);

    pull = new Audio();
    var pullSrc = document.createElement("source");
    pullSrc.type = "audio/mpeg";
    pullSrc.src = "audio/pull.mp3";
    pull.appendChild(pullSrc);
    
    bubbleClose = new Audio();
    var bubbleCsrc = document.createElement("source");
    bubbleCsrc.type = "audio/mpeg";
    bubbleCsrc.src = "audio/bubbleClose.mp3";
    bubbleClose.appendChild(bubbleCsrc);

    voiceAudio = new Audio();
    var voiceSrc = document.createElement("source");
    voiceSrc.type = "audio/mpeg";
    voiceSrc.src = "audio/voice.mp3";
    voiceAudio.appendChild(voiceSrc);

    bubbleOut = new Audio();
    var bubbleOutSrc = document.createElement("source");
    bubbleOutSrc.type = "audio/mpeg";
    bubbleOutSrc.src = "audio/bubbleOut.mp3";
    bubbleOut.appendChild(bubbleOutSrc);
});