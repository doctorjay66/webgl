function create_scene() {
    //window.addEventListener( 'keypressed', onKeyPressed );
    /*
*/
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( '#b0c4de', 1 );
    renderer.autoClear = true;
    document.body.appendChild( renderer.domElement );
	scene = new THREE.Scene();
	var planeGeometry = new THREE.PlaneBufferGeometry(35*4*2, 35*4*2, 1, 1);
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	//var mesh_text = new THREE.ImageUtils.loadTexture('https://rawgit.com/doctorjay66/webgl/master/campo_1.jpg');
	//var planeMaterial = new THREE.MeshBasicMaterial({map:mesh_text});
	plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.receiveShadow = true;
	plane.rotation.x = -1/2 * Math.PI; plane.position.x = 0; plane.position.y = 0; plane.position.z = 0;
	scene.add(plane);
	var ballGeom = new THREE.SphereGeometry(0.6, 20, 20);
	var ballMat =  new THREE.MeshLambertMaterial({color: 0xffffff});
	ball = new THREE.Mesh(ballGeom, ballMat);
	ball.position.y = BALL_Y;
	ball.position.x = 15*4;
	scene.add(ball);
	shot_target_mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(unit_meter*7, shot_target_ratio*7*unit_meter, 1, 1), 
	                                  new THREE.MeshBasicMaterial({color: 0xffffff}));	
    shot_target_mesh.position.x = 35*4-12;
    shot_target_mesh.rotation.y = -0.5 * Math.PI;
    shot_target_mesh.position.y += 5;
    scene.add(shot_target_mesh);
    var spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(200, 300, 140);
    spotLight.castShadow = true;
    scene.add(spotLight);
    var aspect = window.innerWidth / window.innerHeight;
	camera = new THREE.PerspectiveCamera( 45, aspect, 1, 10000 );
	//camera.position.set( -45.0, 20.0, 100 );
	camera.position.set( -25.0, 60.0, 0 );
	//camera.lookAt(scene.position);
	camera.lookAt(new THREE.Vector3(60, 10, 0));
    scene.add(camera);    
    /*PLAYERS['p1'] = new THREE.PlayerChar();
    PLAYERS['p1'].load("figure_rigged_run_new.json", new THREE.Vector3(15*4, 0, 0), 0, add_player, 0xFF0000);
    PLAYERS['p2'] = new THREE.PlayerChar();
    PLAYERS['p2'].load("figure_rigged_run_new.json", new THREE.Vector3(15*4+10, 0, -10), 0, add_player, 0xFF0000);*/
    //PLAYERS['save'] = new THREE.PlayerChar();
    //PLAYERS['save'].load("figure_rigged_save_new.json", new THREE.Vector3(35*4-15, 0, 0), Math.PI/2,add_player, 0x0000BB); 
    //dest_point = new THREE.Vector3(20,0,20);
    animate();
}

function add_player(mesh, pos, rot) {
    mesh.position.x = pos.x;
    mesh.position.z = pos.z;
    mesh.position.y = PLAYER_Y;
    mesh.rotation.y = rot;
    mesh.castShadow = true;
    scene.add( mesh );
    //SELECTED_PLAYER = PLAYERS['p1'];
}
