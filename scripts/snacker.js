// Fade main music + cheato sound effects
function fadeMusic() {
    if (flapAudio > 0.01) {
        flapAudio.volume -= .01;
    }
    if (music.volume > 0.01) {
        if (snackerMDL.position.z < -5) {
            snackerMDL.position.z += 2;
        }
        music.volume -= .001;
        snackerMusic.volume += .001;
        model.position.x -= .03
        setTimeout('fadeMusic()', 10);
    } else {
        music.pause();
        flapAudio.volume = 0;
    }

}

// Start snacker sequence.
function snackerStart() {
    scripted = true;
    fadeMusic();
    snackerMusic.play();
    // Load new avatar dialogue head
    cImageSrc = 'images/snacker.png';
    document.getElementById('loaderImage').style.backgroundImage = 'url(' + cImageSrc + ')';

}

//Declare new empty animPlayer and load model
document.querySelector('#jiggy').addEventListener('click', function() {

    animPlayerSnacker = new THREE.AnimationMixer(snackerMDL);
    var loader2 = new THREE.GLTFLoader();
    var actions2;


    loader2.load('resources/snacker.glb', handle_load2);

    function handle_load2(gltf) {

        //Load model and apply material
        snackerMDL = gltf.scene;
        snackerMDL.children[0].material = new THREE.MeshLambertMaterial({
            morphTargets: true
        });

        //Add model and adjust postion
        scene.add(snackerMDL);
        snackerMDL.position.z = -750;
        snackerMDL.position.y = -1.5;
        snackerMDL.scale.set(0.01, 0.01, 0.01);
        snackerMDL.rotation.y = (THREE.Math.degToRad(180));

        //Setup animation and play
        var animations = gltf.animations;
        animPlayerSnacker = new THREE.AnimationMixer(snackerMDL);
        var swimAnimation = animPlayerSnacker.clipAction(animations[0]);
        actions2 = [swimAnimation];
        swimAnimation.play();

    }
});