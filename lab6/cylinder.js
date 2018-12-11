var camera, scene, renderer, controls, geom, mesh, light;
var delta = 0, colorFlag = true;

function init() {
    // Grab our container div
    var container = document.getElementById("container");
    const approx = document.getElementById("approx");
    const intens = document.getElementById("intens");

    // Create the Three.js renderer, add it to our div
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    container.appendChild( renderer.domElement );

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Create a camera and add it to the scene
    camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 500 );
    camera.position.set( 0, 0, 200 );
    scene.add( camera );

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;

    controls.screenSpacePanning = false;
    controls.minDistance = 10;
    controls.maxDistance = 600;
    // controls.maxPolarAngle = Math.PI;

    scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );

    light = new THREE.DirectionalLight(0xffffff);
    light.intensity = intens.value;
    light.reflectivity = intens.value;
    light.position.set( 600, 600, 600 ).normalize();
    scene.add( light );

    geom = initGeom();

    // var color = new THREE.Color("rgb(0, 255, 255)");
    var color = new THREE.Color("hsl(0, 100%, 50%)");
    var material = new THREE.MeshLambertMaterial( { color: color } );

    mesh = new THREE.Mesh(geom, material);

    scene.add( mesh );
}

const A = 20, B = 10, H = 60;
let num = approx.value;

approx.onchange = function (e) {
    num = approx.value;

    scene.remove(mesh);
    geom = initGeom();

    var cyan = new THREE.Color("rgb(0, 255, 255)");
    var material = new THREE.MeshLambertMaterial( { color: cyan } );

    mesh = new THREE.Mesh(geom, material);

    scene.add( mesh );
    render();
}

intens.onchange = function(e) {
    light.intensity = intens.value;
}

function fplus(x) {
    return Math.sqrt((1 - (x * x) / (A * A)) * B * B);
}

function fminus(x) {
    return -Math.sqrt((1 - (x * x) / (A * A)) * B * B);
}

function initGeom() {
    //аппроксимируем выпуклое тело треугольниками
    var geometry = new THREE.BufferGeometry();
    var vertices = [];

    var step = 2 * A / num;
    //лицевые треугольники
    var z = H / 2;
    var prevX = -A, prevY = fplus(prevX);
    for (var x = -A + step; Math.floor(x) < A; x += step) {
        var y = fminus(x);
        vertices.push( 0, 0, z );
        vertices.push( prevX, prevY, z);
        vertices.push( x, y, z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        vertices.push( x, y, -z );
        vertices.push( x, y, z );
        vertices.push( prevX, prevY, z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        prevX = x;
        prevY = y;
    }
    var x = A, y = fminus(x);
    vertices.push( 0, 0, z );
    vertices.push( prevX, prevY, z);
    vertices.push( x, y, z );

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    vertices.push( x, y, -z );
    vertices.push( x, y, z );
    vertices.push( prevX, prevY, z );
    /////////////////////////////////////////////

    prevX = -A, prevY = fminus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fplus(x);
        vertices.push( x, y, z );
        vertices.push( prevX, prevY, z);
        vertices.push( 0, 0, z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        vertices.push( prevX, prevY, -z);
        vertices.push( prevX, prevY, z);
        vertices.push( x, y, z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        prevX = x;
        prevY = y;
    }
    var x = A, y = fplus(x);
    vertices.push( x, y, z );
    vertices.push( prevX, prevY, z);
    vertices.push( 0, 0, z );

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    vertices.push( prevX, prevY, -z);
    vertices.push( prevX, prevY, z);
    vertices.push( x, y, z );

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    // задние треугольники
    z = -H / 2;
    var prevX = -A, prevY = fplus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fplus(x);
        vertices.push( x, y, z );
        vertices.push( 0, 0, z );
        vertices.push( prevX, prevY, z);

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        vertices.push( x, y, z);
        vertices.push( prevX, prevY, z);
        vertices.push( x, y, -z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        prevX = x;
        prevY = y;
    }
    var x = A, y = fplus(x);
    vertices.push( x, y, z );
    vertices.push( 0, 0, z );
    vertices.push( prevX, prevY, z);

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    vertices.push( x, y, z);
    vertices.push( prevX, prevY, z);
    vertices.push( x, y, -z );

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
    /////////////////////////////////////////////
    prevX = -A, prevY = fminus(prevX);
    for (var x = -A + step; x < A; x += step) {
        var y = fminus(x);

        vertices.push( prevX, prevY, z);
        vertices.push( 0, 0, z );
        vertices.push( x, y, z );

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        vertices.push( prevX, prevY, -z);
        vertices.push( prevX, prevY, z);
        vertices.push( x, y, z);

        geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

        prevX = x;
        prevY = y;
    }
    var x = A, y = fminus(x);
    vertices.push( prevX, prevY, z);
    vertices.push( 0, 0, z );
    vertices.push( x, y, z );

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    vertices.push( prevX, prevY, -z);
    vertices.push( prevX, prevY, z);
    vertices.push( x, y, z);

    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    geometry.computeVertexNormals();
    return geometry;
}

function changeColor(x) {
    // scene.children[3].material.color.setHSL(0.7, 1, 0,5);
    scene.children[3].material.color = new THREE.Color("hsl(" + x + ", 100%, 50%)");
}

function animate() {
    requestAnimationFrame( animate );
    scene.children[3].material.color = new THREE.Color("hsl(" + delta%360 + ", 100%, 50%)");
    if (delta >= 360) {
        colorFlag = false;
    }else if (delta <= 0) {
        colorFlag = true;
    }
    if (colorFlag) {
        delta += 1;
    } else {
        delta -= 1;
    }
    
    controls.update();
    render();
}

function render() {
    renderer.render( scene, camera );
}

function onLoad()
{
    init();
    render();
    animate();
}