var camera, scene, renderer, mouseX;
var mesh, light, ground, compass;
var rotation = 0;
var compassMaxRotate = 0.03;
var compassAccelerate = 0.0005;
var compassCurrSpeed = 0;
var compassCurrRotation = 0;
init();
animate();

function init() {
    camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
    camera.position.z = 0;
    compass = makeCompass();
    camera.add(compass);
    camera.add(makeCompassHouse());

    scene = new THREE.Scene();
    var texture = new THREE.TextureLoader().load( 'images/grass.jpg' );
    var geometry = new THREE.BoxBufferGeometry( 200, 200, 200 );
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    mesh = new THREE.Mesh( geometry, material );
    //scene.add( mesh );

    scene.add(camera);
    ground = ground();
    scene.add(ground);

    forest(25,scene);


    light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 1, 0 );
    scene.add( light );


    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    mouseX = window.innerWidth / 2;

    document.body.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener( 'mousemove', getMouseX );
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

function ground() {
    var map = new THREE.TextureLoader().load( 'images/grass.jpg' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.repeat.set( 40, 40 );
    map.anisotropy = 16;

    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide } );

    object = new THREE.Mesh( new THREE.PlaneGeometry( 4000, 4000, 40, 40 ), material );
    object.position.set( 0, -100, 0 );
    object.rotation.x = Math.PI *.5;

    return object;
}

function makeCompass() {
    var map = new THREE.TextureLoader().load( 'images/compass.png' );
    map.wrapS = map.wrapT = THREE.RepeatWrapping;
    map.anisotropy = 16;
    var material = new THREE.MeshLambertMaterial( { map: map, side: THREE.DoubleSide, transparent: true } );
    object = new THREE.Mesh( new THREE.PlaneGeometry( 8,8,1,1 ), material );
    object.position.set( 0, -2, -2 );
    object.rotation.x = Math.PI *-.5;

    return object;

}

function makeCompassHouse() {

    var cube = new THREE.Mesh( new THREE.BoxGeometry( 10, 3, 10 ), new THREE.MeshBasicMaterial( {color: 0x457551} ) );
    var needle = new THREE.Mesh( new THREE.BoxGeometry( 0.05, 0.05, 1 ), new THREE.MeshBasicMaterial( {color: 0xff0000} ) );

    needle.position.set( 0, 2, -3 );
    cube.add(needle);
    cube.position.set( 0, -4, -3 );
    return cube;
}

function forest(treecount, scene) {
    var loader = new THREE.ColladaLoader();
    loader.options.convertUpAxis = true;
    loader.load( 'models/DeadTree21.dae', function ( collada ) {


        for (var i = 0; i < treecount; i++) {
            var dae = collada.scene.clone();

            dae.scale.x = dae.scale.y = dae.scale.z = 1;

            dae.position.x = (Math.random() * 2000) - 1000;
            dae.position.y = -1 * ((Math.random() * 25) + 100);
            dae.position.z = (Math.random() * 2000) - 1000;
            dae.rotation.y = (Math.random() * (Math.PI * 2));

            dae.updateMatrix();
            scene.add(dae);
        }
    } );
}

function getMouseX(evt) {
    mouseX = evt.pageX;
}

function rotateTo(target) {
    if (compassCurrRotation < target) {
        compassCurrSpeed += compassAccelerate;
    } else if (compassCurrRotation > target) {
        compassCurrSpeed -= compassAccelerate;
    }

    compassCurrSpeed = Math.min( compassCurrSpeed , compassMaxRotate);
    compassCurrSpeed = Math.max( compassCurrSpeed , -compassMaxRotate);

    if (Math.abs(target - compassCurrRotation) < 0.005) {
        compassCurrSpeed *= .9;
    }
    compassCurrRotation += compassCurrSpeed;
    if (Math.abs(compassCurrSpeed) < 0.005 && Math.abs(target - compassCurrRotation) < 0.005) {
        compassCurrSpeed = 0 ;
        compassCurrRotation = target;
    }

    return compassCurrRotation;
}

function animate() {
    requestAnimationFrame( animate );

    if (mouseX < (window.innerWidth/2) -50 ){
        rotation += 0.01;
    } else if (mouseX > (window.innerWidth/2) +50 ) {
        rotation -= 0.01;
    }



    camera.rotation.y = rotation;
    compass.rotation.z = rotateTo(-rotation);

    renderer.render( scene, camera );
}