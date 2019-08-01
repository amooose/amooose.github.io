    var renderer, scene, snackerMDL, model;
document.querySelector('#jiggy').addEventListener('click', function() {

    var clock = new THREE.Clock();
    var  camera, delta = 0, mouse3D, mouse3DS,
        myCanvas = document.getElementById('cheato3DCanvas');

    //RENDERER
    renderer = new THREE.WebGLRenderer({
        canvas: myCanvas,
        antialias: true
    });
    renderer.setClearColor(0x171716);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    //CAMERA
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 700);

    //SCENE
    scene = new THREE.Scene();

    //LIGHTS
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

    // THREE.JS stars modified from https://codepen.io/jacoboakley/pen/oebwyo //
    var starsGeometry = new THREE.Geometry();
    for (var i = 0; i < 10000; i++) {
        var star = new THREE.Vector3();
        star.x = THREE.Math.randFloatSpread(2000);
        star.y = THREE.Math.randFloatSpread(2000);
        star.z = THREE.Math.randFloatSpread(2000);
        starsGeometry.vertices.push(star);
    }

    var starsMaterial = new THREE.PointsMaterial({
        color: 0xffffff
    });
    var starField = new THREE.Points(starsGeometry, starsMaterial);
    scene.add(starField);
    //////////////////////////////////////////////////////////////////////////


    var mouseDown = 0;
    document.addEventListener("mouseleave", function(event) {
        if (!clicked && mouseDown == 1) {
            clicked = true;
        }
        mouseDown = 0;
    });

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

    //Start render loop
    renderLoop();

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


    var i = 2.0;
    var clicked = false;
    function bounce() {
        if (i == 2.0) {
            pokeAudio.play();
        }
        
        i += .07;
        var morletFormula = 1 * ((0.007 * Math.pow(Math.E, (-1 * (Math.pow(i - 4, 2.0) / 2.0)))) * Math.cos(5.0 * (i + 4))) + .01;
        model.scale.y = morletFormula;

        if (i > 7) {
            model.scale.y = .01;
            clicked = false;
            i = 2.0;
        }

    }

    var hitCheck = document.getElementById("hitbox");
    hitCheck.addEventListener("click", function() {
        clicked = true;
    }, false);

    

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

    window.addEventListener('resize', onWindowResize, false);
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }


    // 60 fps
    var interval = 1 / 60;
    var Sinterval = 1 / 20;
    var msP = .5;
    var frame = 0;
    
    function snackerRenderLoop(){
    
    }
    
    var inScene = false;
    function renderLoop() {
        
        requestAnimationFrame(renderLoop)
        delta += clock.getDelta();
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