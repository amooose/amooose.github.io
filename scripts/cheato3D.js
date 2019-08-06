var renderer, scene, snackerMDL, model;


// wait for main puzzle piece click
document.querySelector('#jiggy').addEventListener('click', function() {
    var i = 2.0;
    var clicked = false;
    var clock = new THREE.Clock();
    var  camera, delta = 0, mouse3D, mouse3DS,
        cheato3DCanvas = document.getElementById('cheato3DCanvas');

    // init renderer
    renderer = new THREE.WebGLRenderer({
        canvas: cheato3DCanvas,
        antialias: true
    });
    renderer.setClearColor(0x171716);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    // init camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 700);

    // init scene
    scene = new THREE.Scene();

    // init lights
    var light = new THREE.AmbientLight(0xffffff, 0.5);
    var light2 = new THREE.PointLight(0xffffff, 0.5);
    scene.add(light);
    scene.add(light2);

    //Declare new empty animPlayer and load model
    var animPlayer = new THREE.AnimationMixer(model);
    var loader = new THREE.GLTFLoader();
    var actions;
    loader.load('resources/cheato.glb', handle_load);

    function handle_load(gltf) {
        //Load model and apply material
        model = gltf.scene;
        model.children[0].material = new THREE.MeshLambertMaterial({
            morphTargets: true
        });

        //Add model and adjust postion
        scene.add(model);
        model.position.z = -100;
        model.position.y = -1.5;
        model.scale.set(0.01, 0.01, 0.01);
        model.rotation.y = (THREE.Math.degToRad(180));

        //Setup animation and play
        var animations = gltf.animations;
        animPlayer = new THREE.AnimationMixer(model);
        var flyAnimation = animPlayer.clipAction(animations[0]);
        actions = [flyAnimation];
        flyAnimation.play();
    }

    // add stars
    scene.add(starField);

    // treat leaving the page as releasing the mouse
    var mouseDown = 0;
    document.addEventListener("mouseleave", function(event) {
        if (!clicked && mouseDown == 1) {
            clicked = true;
        }
        mouseDown = 0;
    });

    // Handle stretching / bouncing model
    document.body.onmousedown = function() {
        mouseDown = 1;
        if ($('#hitbox:hover').length == 0 && !inScene) {
            pull.play();
        }
    }
    document.body.onmouseup = function() {
        mouseDown = 0;
        if (!clicked) {
            clicked = true;
        }
    }
    
    //Mousemove event
    window.addEventListener('mousemove', function(e) {
        mouse3D = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 62 - 30,
            -(event.clientY / window.innerHeight) * 32 + 10,
            20);
        mouse3DS = new THREE.Vector3(
            (event.clientX / window.innerWidth) * 62 - 30,
            -(event.clientY / window.innerHeight) * 32 + 20,
            20);
    });

    //Start render loop
    renderLoop();

    
    
    // Bounce cheato's model.
    function bounce() {
        // Start of bounce, play audio
        if (i == 2.0) {
            pokeAudio.play();
        }
        
        // Bounce based on a modified Morlet Wavelet
        i += .07;
        var morletFormula = 1 * ((0.007 * Math.pow(Math.E, (-1 * (Math.pow(i - 4, 2.0) / 2.0)))) * Math.cos(5.0 * (i + 4))) + .01;
        model.scale.y = morletFormula;

        // Return model to original scale at end of bounce.
        if (i > 7) {
            model.scale.y = .01;
            clicked = false;
            i = 2.0;
        }

    }

    // Listen for hitbox's click.
    // Using html element as a hitbox avoids costly
    // raytracing mouseclick intercept detecting.
    var hitCheck = document.getElementById("hitbox");
    hitCheck.addEventListener("click", function() {
        clicked = true;
    }, false);

    
    // Stretch model based on mouse position. Work in progress.
    function stretch() {
        window.addEventListener('mousemove', function(e) {
        
            mX = mouse3D.x * .01;
            mY = mouse3D.y * .01;
            mZ = mouse3D.z * .01;

            if (mouseDown == 1) {
                if (mY <= 0) {
                    model.scale.y = .01 - (-.04 * mY);
                } else {
                    model.scale.y = .01 + Math.pow(mY, Math.pow(Math.E, mY)) * .1;
                }
                model.rotation.z = (mX * -1) * 2;
            }
        });
    }

    // Resize scene/renderer based on window size.
    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Sync flapping noise to the animation.
    // Will slowly unsync if we dont reset the model's 
    // animation at its final frame.
    function syncAudioAnimation(){
        if (frame == 0) {
                actions[0].reset();
                actions[0].timeScale = 1.15;
            }

        if (frame == 42) {
            frame = 0;
            flapAudio.pause();
            flapAudio.currentTime = 0;
            flapAudio.play();
        } else {
            frame++;
        }
    }


    // 60 fps
    var interval = 1 / 60;
    var Sinterval = 1 / 20;
    var msP = .5;
    var frame = 0;

    
    var inScene = false;
    function renderLoop() {
        requestAnimationFrame(renderLoop)
        delta += clock.getDelta();
        // only update at 60fps so model syncs with audio
        if (delta > interval) {
            if (clicked && !inScene) {
                bounce();
            }
            if (mouseDown == 1 && !inScene) {
                stretch();
            }
            
            starField.rotation.z += 0.002;
            starField.rotation.x -= 0.002;
            starField.rotation.y += 0.002;

            renderer.render(scene, camera);
            animPlayer.update(delta);
            
            if(animPlayerSnacker){
            animPlayerSnacker.update(delta);
            }
            
            syncAudioAnimation();

            if (model) {
                if(model.position.x != 0){
                    inScene = true;
                }
                
                // initial zoom-in
                if (model.position.z < -5) {
                    if (model.position.z > -11) {
                        msP -= .0217
                        model.position.z += msP;
                    } else {
                        model.position.z += .5;
                    }
                }
                    
                if (mouseDown == 0) {
                    if (mouse3D) {
                        model.lookAt(mouse3D);
                        snackerMDL.lookAt(mouse3DS);

                    } else {
                        // Make model look forward despite no mouse
                        var noMouse = new THREE.Vector3(-1.39, -3.94, 20);
                        model.lookAt(noMouse);
                        snackerMDL.lookAt(noMouse);
                    }
                }
                
        }
        delta = delta % interval;
        }

    }
});