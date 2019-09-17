// Basic 3D visualizer by https://github.com/amooose

//Random list of colors
var colorArray = ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6', 
                  '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
                  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', 
                  '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC',
                  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', 
                  '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
                  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', 
                  '#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933',
                  '#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3', 
                  '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'];

// Init scene
var sceneShape = new THREE.Scene();

// Scene lighting setup -- Lighting code from https://github.com/ics-creative/150910_sound_visualizer/blob/master/html/js/ts-libs/threejs/tests/webgl/webgl_lights_heimsphere.ts
var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
hemiLight.color.setHSL( 0.6, 1, 0.6 );
hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
hemiLight.position.set( 0, 500, 0 );
sceneShape.add( hemiLight );
dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
dirLight.color.setHSL( 0.1, 1, 0.95 );
dirLight.position.set( -1, 1.75, 1 );
dirLight.position.multiplyScalar( 50 );
sceneShape.add( dirLight );
dirLight.castShadow = true;
dirLight.shadowMapWidth = 2048;
dirLight.shadowMapHeight = 2048;
var d = 50;
dirLight.shadowCameraLeft = -d;
dirLight.shadowCameraRight = d;
dirLight.shadowCameraTop = d;
dirLight.shadowCameraBottom = -d;
dirLight.shadowCameraFar = 3500;
dirLight.shadowBias = -0.0001;
///////////////////////////////

//Camera+Renderer init
var camera = new THREE.PerspectiveCamera( 95, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
camera.position.z = 6;
renderer.autoClear = false;

function getRandom() {
  var num = Math.floor(Math.random()*10);
  var randNP = Math.floor(Math.random()*2) == 1 ? 1 : -1;
  num = num*randNP+(Math.floor(Math.random()*10)*.2)
  return num;
}

//Init shape and add to sceneShape
var geometry = new THREE.OctahedronGeometry(1,0);
var material = new THREE.MeshPhongMaterial( { color: 0x00ff00} );
var shape = new THREE.Mesh( geometry, material );
sceneShape.add(shape);
///////////////////


// Resize scene/renderer based on window size.
window.addEventListener('resize', onWindowResize, false);
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Wait until user clicks button (Chrome requires this due to not being
// able to create AudioContext() until user interacts with page)
// Parts of audio init code from http://35.245.74.165/music-visualiser-with-three-js/
document.querySelector('.playbtn').addEventListener('click', function() {
    // Audio init ////
    var audio = new Audio();
    audio.src = 'ChillDay_comp.mp3';
    //audio.crossOrigin = 'anonymous';
    audio.load();
    audio.play();
    var context = new AudioContext();
    var src = context.createMediaElementSource(audio);
    var analyser = context.createAnalyser();
    src.connect(analyser);
    analyser.connect(context.destination);
    analyser.fftSize = 256;
    var bufferLength = analyser.frequencyBinCount;
    console.log(bufferLength);
    var dataArray = new Uint8Array(bufferLength);
    /////////////////
  
    // Select a random color, create a new meshMaterial and add to to shape,
    // flag shape for material update for next frame.
    var prevColor = '0x00ff00';
    function changeColor(){
        var colorRand = colorArray[Math.floor(Math.random()*colorArray.length)];
        prevColor = colorRand;
        var material2 = new THREE.MeshPhongMaterial( {color: colorRand, specular: 0xffffff, shininess: 50} );
        shape.material = material2;
        shape.material.needsUpdate = true;
    }
    
    function changeOpacity(opLvl){
        var colorRand = colorArray[Math.floor(Math.random()*colorArray.length)];
        
        var materialNew = new THREE.MeshPhongMaterial( {transparent: true, opacity: opLvl,
        color: prevColor, specular: 0xffffff, shininess: 50} );
        
        shape.material = materialNew;
        shape.material.needsUpdate = true;
    }
    
    var rotSpeed = 0.01;
    var lightness = 100;
    
    // Loop to render each frame
    function renderFrame() {
        requestAnimationFrame(renderFrame);
        
        // Location on the dataArray ("bars" on a visualizer, 0 being closer to bass, 0+ closer to treble)
        // Experiment with these values.
        var loc = 8;
        
        //Scaling based on bass+treble.
        shape.scale.x = dataArray[loc-2]*.02;
        shape.scale.y = dataArray[loc]*.02;
        shape.scale.z = dataArray[loc+2]*.02;
        //console.log("scale:"+(((shape.scale.z)/3)-(0.22)));
        
        //opacity optional, looks better without.
        //changeOpacity((((shape.scale.z)/3)-(0.22)));
        // z axis is chosen for treble. When the z scale goes 
        // grows to its largest, change the color of the shape.
        // This number may be tweaked for specific songs
        if(shape.scale.z>3.8){
            changeColor();
        }
        
        // ambient rotation
        shape.rotation.y += 0.01;
        shape.rotation.x += 0.01;
        
        renderer.render( sceneShape, camera );
        analyser.getByteFrequencyData(dataArray);

    }
    // begin render
    audio.play();
    renderFrame();
});

// JQuery - hide button upon click
$('.playbtn').click(function(){$(this).hide();});