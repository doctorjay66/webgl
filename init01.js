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

var clock = new THREE.Clock(), keyboard = new KeyboardState();

var start = false;

var PLAYERS = {}, INTERSECTED, LAST_SELECTED, SELECTED, SELECTED_PLAYER, ground, set_action_phase = false,
    mouse = new THREE.Vector2(), offset = new THREE.Vector3(), up_pressed, READY=1, WAIT=0, OVER=-1, action_list = [],
    user_action, SHOOT=5, PASS=6, CROSS=7, CROSS_HEAD=8, num_click=0, j_dest = new THREE.Vector3(0,0,0),
    dest_point, shot_target_mesh, ball, unit_meter = 4.0, shot_target_ratio = 2.70/7, gk_orient = new THREE.Vector3(-1,0,0),
    z_orient = new THREE.Vector3(0, 0, 1), goal_center = new THREE.Vector3(35*4-12, FLOOR, 0), 
    BALL_Y=-4.2, dummy = new THREE.Object3D();

function init() {
	document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('mouseup', onDocumentMouseUp, false ); 
	container = document.getElementById( 'container' );

	camera = new THREE.PerspectiveCamera( 45, SCREEN_WIDTH / SCREEN_HEIGHT, 1, 10000 );
	camera.position.set( -25.0, 60.0, 0 );
	camera.lookAt(new THREE.Vector3(60, 10, 0));

	scene = new THREE.Scene();
	scene.add( camera );
	
	//var mesh_text = new THREE.ImageUtils.loadTexture('https://rawgit.com/doctorjay66/webgl/master/campo_1.jpg');
	var planeGeometry = new THREE.PlaneBufferGeometry(35*4*2, 35*4*2, 1, 1);
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	//var planeMaterial = new THREE.MeshBasicMaterial({map:mesh_text});
	ground = new THREE.Mesh(planeGeometry, planeMaterial);
	ground.receiveShadow = true;
	ground.position.set( 0, FLOOR, 0 );
	ground.rotation.x = -Math.PI/2;
	scene.add( ground );
	var ballGeom = new THREE.SphereGeometry(0.6, 20, 20);
	var ballMat =  new THREE.MeshLambertMaterial({color: 0xffffff});
	ball = new THREE.Mesh(ballGeom, ballMat);
	ball.position.y = BALL_Y;
	ball.position.x = 15*4;
	scene.add(ball);
	/*dummy = new THREE.Mesh(ballGeom, ballMat);
	dummy.position = new THREE.Vector3(35*4-12, 0, 0);
	scene.add(dummy);*/
	shot_target_mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(unit_meter*7, shot_target_ratio*7*unit_meter, 1, 1), 
	                                  new THREE.MeshBasicMaterial({color: 0xffffff}));	
    shot_target_mesh.position.x = 35*4-12;
    shot_target_mesh.rotation.y = -0.5 * Math.PI;
    //shot_target_mesh.position.y += 5;
    scene.add(shot_target_mesh);

    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 300, 140);
    spotLight.castShadow = true;
    scene.add(spotLight);
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
   	/*if ( Detector.webgl )
		renderer = new THREE.WebGLRenderer( {antialias:true} );
	else
		renderer = new THREE.CanvasRenderer();*/
    renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
    renderer.setClearColor( '#b0c4de', 1 );
    renderer.autoClear = true;
    container.appendChild( renderer.domElement );
    var loader = new THREE.JSONLoader();
	loader.load( "figure_rigged_run_new.json", function ( geometry, materials ) {
		createScene( geometry, materials,15*4, 0, 0, 1, 0xFF0000, 'p1' );
		//createScene( geometry, materials,15*4, 0, -10, 1, 0xFF0000, 'p2' )
	});
	loader.load( "figure_rigged_run_new.json", function ( geometry, materials ) {
		//createScene( geometry, materials,15*4, 0, 0, 1, 0xFF0000, 'p1' );
		createScene( geometry, materials,15*4, 0, -10, 1, 0xFF0000, 'p2' );
	});
	loader.load( "figure_rigged_save_new.json", function ( geometry, materials ) {
		//createScene( geometry, materials,15*4, 0, 0, 1, 0xFF0000, 'p1' );
		createScene( geometry, materials,35*4-12, 0, 0, 1, 0x0000FF, 'save' );
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
			
function createScene( geometry, materials, x, y, z, s, color, name ) {
    geometry.computeBoundingBox();
    var bb = geometry.boundingBox;
    
    var mat = new THREE.MeshLambertMaterial( { color: color /*0xFF0000*/, skinning: true } );
    mesh = new THREE.SkinnedMesh(geometry, mat);
    mesh.animations = {};
    for ( var i = 0; i < geometry.animations.length; ++i ) {
	    var animName = geometry.animations[ i ].name;
		mesh.animations[ animName ] = new THREE.Animation( mesh, geometry.animations[ i ] );
	}
    mesh.position.set(x, y, z);
    if(name == 'save') {
        mesh.rotation.y = -0.5 * Math.PI;  
        mesh.position.set(-10, y, 0);   
        //dummy.position = new THREE.Vector3(35*4, 0, 0);   
        dummy.position.x = 35*4-12;
        dummy.add(mesh);
        
        scene.add( dummy );
        //var arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), dummy.position, 10, 0x0000ff);
        //scene.add(arrow);
        //dummy.rotation.y = -Math.PI/8;
    } else {
        
        scene.add( mesh );
    }
    PLAYERS[name] = mesh;
    //console.log(PLAYERS);
    //var animation = new THREE.Animation( mesh, geometry.animation );
}

function animate() {
    requestAnimationFrame( animate, renderer.domElement );
    var delta = clock.getDelta();
    THREE.AnimationHandler.update( delta * 0.5 );
    //up_pressed = false;
    movePLayerByKey(delta);
    if(start) {
        for(var curr_action=0;curr_action<action_list.length;curr_action++) {
    	    executeIfReady(action_list[curr_action], delta)
    	}
    }
    //dummy.rotation.y += 0.03;
    renderer.render( scene, camera );
}

function direction(p1, p2) {
    var dir = new THREE.Vector3(0, 0, 0);

    dir.subVectors(p1, p2);
    dir.normalize();
    return dir;
}
