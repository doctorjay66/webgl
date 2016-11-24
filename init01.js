var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;
var FLOOR = -4.5;
var container,stats;

var camera, scene;
var renderer;

var mesh, helper;

var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

var clock = new THREE.Clock();

var start = false;

function init() {
	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.set( -25.0, 60.0, 0 );
	camera.lookAt(new THREE.Vector3(60, 10, 0));

	scene = new THREE.Scene();
	scene.add( camera );
	
	var mesh_text = new THREE.ImageUtils.loadTexture('campo_1.jpg');
	var planeGeometry = new THREE.PlaneBufferGeometry(35*4*2, 35*4*2, 1, 1);
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var ground = new THREE.Mesh(planeGeometry, planeMaterial);
	ground.receiveShadow = true;
	ground.position.set( 0, FLOOR, 0 );
	ground.rotation.x = -Math.PI/2;
	scene.add( ground );
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 300, 140);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.setClearColor( '#b0c4de', 1 );
    renderer.autoClear = true;
    container.appendChild( renderer.domElement );
    var loader = new THREE.JSONLoader();
	loader.load( "figure_rigged_run_new.json", function ( geometry, materials ) {
		createScene( geometry, materials,15*4, 0, 0, 1, 0xFF0000 )
	});
	
	initGUI();
	
	window.addEventListener( 'resize', onWindowResize, false );
	
	animate();
}

function onWindowResize() {
	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );
}
			
function createScene( geometry, materials, x, y, z, s, color ) {
    geometry.computeBoundingBox();
    var bb = geometry.boundingBox;
    
    var mat = new THREE.MeshLambertMaterial( { color: color /*0xFF0000*/, skinning: true } );
    mesh = new THREE.SkinnedMesh(geometry, mat);
    mesh.animations = {};
    for ( var i = 0; i < geometry.animations.length; ++i ) {
	    var animName = geometry.animations[ i ].name;
		mesh.animations[ animName ] = new THREE.Animation( mesh, geometry.animations[ i ] );
	}
    mesh.position.set(x, y, z)
    scene.add( mesh );
    //var animation = new THREE.Animation( mesh, geometry.animation );
}

function initGUI() {
    var gui = new dat.GUI();
    var controls = {
		start_actions: function() {			
			start = true;
			//console.log(mesh.geometry.animations);
			mesh.animations['run'].play(0, 1.0);
		},
		stop_actions: function() {			
			start = false;
			//console.log(mesh.geometry.animations);
			mesh.animations['run'].stop();
		}     
    };
    gui.add( controls, 'start_actions' ).name("Start Action");
    gui.add( controls, 'stop_actions' ).name("Stop Action");
}

function animate() {
    requestAnimationFrame( animate, renderer.domElement );
    var delta = clock.getDelta();
    THREE.AnimationHandler.update( 1.0 );
    renderer.render( scene, camera );
}
