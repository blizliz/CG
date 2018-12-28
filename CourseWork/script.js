let camera, scene, renderer, controls, geom, mesh, light;

var P00 = [0, 0, 20];
var P01 = [20, 20, 20];
var P10 = [20, 0, 0];
var P11 = [0, 20, 0];

function init() {
    // Grab our container div
    var container = document.getElementById("container");
    const approx = document.getElementById("approx");
    const intens = document.getElementById("intens");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild(renderer.domElement);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Create a camera and add it to the scene
    camera = new THREE.PerspectiveCamera(45, container.offsetWidth / container.offsetHeight, 1, 500);
    camera.position.set(0, 0, 100);
    scene.add(camera);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 600;
    // controls.maxPolarAngle = Math.PI;

    scene.add(new THREE.HemisphereLight(0x606060, 0x404040));

    light = new THREE.DirectionalLight(0xffffff);
    light.intensity = 0.8;
    light.reflectivity = 0.8;
    light.position.set(600, 600, 600).normalize();
    scene.add(light);

    geom = initGeom();

    var cyan = new THREE.Color("rgb(0, 255, 255)");
    var material = new THREE.MeshLambertMaterial({color: cyan});

    mesh = new THREE.Mesh(geom, material);

    scene.add(mesh);

    var axesHelper = new THREE.AxesHelper(30);
    scene.add(axesHelper);
}

function mult(point, num) {    //multiply vector by number
    return [point[0] * num, point[1] * num, point[2] * num];
}

function add(v1, v2) {    ///vector addition
    return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function findPoint(u, w) {
    var num1 = (1 - u) * (1 - w);
    var v1 = mult(P00, num1);
    var num2 = (1 - u) * w;
    var v2 = mult(P01, num2);
    var sumVect1 = add(v1, v2);

    num1 = (1 - w) * u;
    v1 = mult(P10, num1);
    num2 = u * w;
    v2 = mult(P11, num2);
    var sumVect2 = add(v1, v2);

    return add(sumVect1, sumVect2);
}

function initGeom() {
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var step = 0.05;
    for (var x = 0; x < 1; x += step) {
        for (var y = 0; y < 1; y += step) {
            var a1 = findPoint(x, y);
            var a2 = findPoint(x + step, y);
            var a3 = findPoint(x, y + step);
            var a4 = findPoint(x + step, y + step);

            vertices.push(a1[0], a1[1], a1[2]);
            vertices.push(a2[0], a2[1], a2[2]);
            vertices.push(a3[0], a3[1], a3[2]);

            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            vertices.push(a2[0], a2[1], a2[2]);
            vertices.push(a3[0], a3[1], a3[2]);
            vertices.push(a4[0], a4[1], a4[2]);

            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            vertices.push(a1[0], a1[1], a1[2]);
            vertices.push(a3[0], a3[1], a3[2]);
            vertices.push(a2[0], a2[1], a2[2]);

            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            vertices.push(a2[0], a2[1], a2[2]);
            vertices.push(a4[0], a4[1], a4[2]);
            vertices.push(a3[0], a3[1], a3[2]);

            geometry.addAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
        }
    }

    geometry.computeVertexNormals();
    return geometry;
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    render();
}

function render() {
    renderer.render(scene, camera);
}

function onLoad() {
    init();
    animate();
}

function onTestChange(testName) {
    const script = document.createElement('script');
    script.src = `./tests/${testName}.js`;
    document.body.appendChild(script);
    script.onload = function () {
        script.onload = null;
        script.remove();
        container.innerHTML = '';
        init();
    }
}

document.getElementById('tests').onchange = function(e) {
    onTestChange(e.target.value);
};

window.onload = onLoad;

