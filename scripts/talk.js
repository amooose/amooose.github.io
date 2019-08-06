var speed = 5;
var speaking = false;
$("#target").html("");
var message = "Cheato the Spell Book you have found, magic cheats I have for you!";
var special = false;
var i = 0, loopCount = message.length;
var played = false;
var scripted = true;
var secret = "sharkbait"
var snacker = false;
var tempAud = new Audio();
var snackMsg = 0;
var custEnd = 685;
var snackLines = ["Mmmm, snacker smell something good. Let me get a little closer.",
    "Stop hiding from snacker, I'm very hungry.", "Snacker could of sworn he smelled tasty dinner, oh well."
];

// Return speed of animated avatar
function getSpeed() {
    return speed;
}

window.onload = function() {

    // Listen for secret to be typed.
    var sIndex = 0;
    document.addEventListener("keypress", function onPress(event) {
        if (event.key === secret[sIndex] && !scripted && !speaking) {
            sIndex++;
            if (sIndex == 9) {
                console.log("yes");
                snacker = true;
                snackerStart();
                setTimeout(function() {
                    speak("Snacker smells tasty dinner, stay right there!", 10);
                }, 1000);
            }
        } else {
            sIndex = 0;
        }
    });

    // Close text speech bubble.
    function closeSpeechBubble() {
        if (scripted) {
            scripted = false;
        }
        speed = 0;
        tempAud.pause();
        tempAud.currentTime = 0;
        setTimeout(function() {
            $("#talkbubble").css("animation", "shrinkBubble .5s");
            $(".slide-right").attr('class', 'slide-back');
            $("#bubbleText").hide();
            bubbleClose.play();
            speaking = false;
        }, 2000);
    }

    // Brings up a text dialogue box and speaks 'newMessage' with an option argument
    // to delay the ending via 'endDelay'
    function speak(newMessage, endDelay) {
        if (!speaking) {
            if (!endDelay) {
                custEnd = 685;
            } else {
                custEnd = endDelay;
            }
            speaking = true;
            speed = 5;
            new imageLoader(cImageSrc, 'startAnimation()');
            $("#bubbleText").show();
            $("#target").empty();
            message = newMessage;
            loopCount = message.length;
            setTimeout(displayVoiceText, 500);
            setTimeout(function() {
                bubbleOut.play();
            }, 100);
            $(".slide-back").attr('class', 'slide-right');
            $(".slide-right").css("animation-play-state", "running");
            setTimeout(function() {
                $("#talkbubble").css("animation", "expandBubble .5s normal forwards");
                $("#talkbubble").css("animation-play-state", "running");
            }, 300);
        }
    }

    // Called when clicking on Cheato's hitbox
    var hitCheck = document.getElementById("hitbox");
    hitCheck.addEventListener("click", function() {
        // Fade mouse pointer pic away.
        $("#clickhere").animate({
            'opacity': '0'
        }, 'fast');
        
        if (!speaking && !scripted && !snacker) {
            speak(" Only one spell Cheato can tell. Enter the code $\"SHARKBAIT\"* on this very page!");
        }
        if (!speaking && snacker && snackMsg < snackLines.length) {
            var time;
            if (snackMsg == 0) {
                time = 1;
            }
            if (snackMsg == 2) {
                time = 200;
            } else {
                time = 685;
            }
            speak(snackLines[snackMsg], time);
            snackMsg++;
        }
    }, false);


    // Show the text character by character
    // Special jittery characters begin with $ and end with *
    function displayVoiceText() {
        speaking = true;
        if (snacker) {
            tempAud = snackerVoice;
        } else {
            tempAud = voiceAudio;
        }
        tempAud.play();
        if (message[i] == '$') {
            special = true;
            i++;
        }
        if (special && message[i] != '$' && message[i] != '*') {
            $("#target").html = $("#target").append('<span class="jittery">' + message[i] + '</span>');
        } else if (message[i] == "*") {
            special = false;
        } else {
            $("#target").html = $("#target").append(message[i]);
        }

        i++;
        if (message[i] != ' ') {
            speed = 3;
        } else {
            speed = 5;
        }

        if (i < loopCount) {
            setTimeout(displayVoiceText, 100);
        } else {
            speed = 15;
            i = 0;
            setTimeout(closeSpeechBubble, custEnd);
        }
    }

    // Wait for click to start scripted intro message
    document.querySelector('#jiggy').addEventListener('click', function() {
        if (!played) {
            played = true;
            setTimeout(function() {
                speak(message);
            }, 8100);
            setTimeout(function() {
                $("#clickhere").animate({
                    'opacity': '100'
                }, 4000);
            }, 17500);

        }

    });

};