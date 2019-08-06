// THREE.JS stars modified from https://codepen.io/jacoboakley/pen/oebwyo //
var starsGeometry = new THREE.Geometry();
for (var k = 0; k < 10000; k++) {
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