function createMesh(geom, mat) {
	var mesh_mat,
	    mesh_text;
	    
	if(mat.color) {
		mesh_mat = new THREE.MeshBasicMaterial({color: mat.color});
	} else if (mat.texture) {
		mesh_text = new THREE.ImageUtils.loadTexture(mat.texture);
		mesh_mat = new THREE.MeshBasicMaterial({map:mesh_text});
	}
	return new THREE.Mesh(geom, mesh_mat);
}

function createScene(param) {
	var clock = new THREE.Clock(),
   	    scene = new THREE.Scene(),
   	    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000),
   	    renderer = new THREE.WebGLRenderer(),
   	    keyboard = new KeyboardState(),
   	    mesh_obj,
   	    plane_mesh,
   	    ball_mesh,
   	    circ,
   	    action_list = [],   	    
   	    mash_models = {},
   	    goalkeeper_mash,
   	    intersectObjectsList = [],
   	    set_player_pos_click_num = 0,  //count clicks to determine if player has to change pos.
   	    selected_mesh = null,
   	    pos_set = new THREE.Vector3(0, 0, 0),
   	    performCommand;
    var mat_blu = new THREE.MeshBasicMaterial(
                {color: 0x0000ff, morphNormals: false,
                    morphTargets: true,
                    vertexColors: THREE.FaceColors});
   	    
   	document.addEventListener('mousedown', onDocumentMouseDown, false);
   	
   	renderer.setSize(window.innerWidth, window.innerHeight);
   	$("#WebGL-output").append(renderer.domElement);
   	controls = new THREE.OrbitControls( camera, renderer.domElement );
   	
   	mesh_obj = createMesh(new THREE.PlaneGeometry(200, 140, 1, 1), {texture: '../assets/textures/campo_1.jpg'});
   	mesh_obj.rotation.x = -0.5 * Math.PI;
   	plane_mesh = mesh_obj;
   	plane_mesh.name = "play_field";
   	scene.add(mesh_obj);   	
   	ball_mesh = createMesh(new THREE.SphereGeometry(0.4, 20, 20), {color: 0xffffff});
   	ball_mesh.name = "ball";
   	ball_mesh.position.y = 0.4;
   	ball_mesh.orient = new THREE.Vector3( 0, 0, 1 );
   	//ball_mesh.actions_over = [];
   	scene.add(ball_mesh);  
   	circ = createMesh(new THREE.CircleGeometry(1, 3), {color: 0x0000ff});
   	circ.rotation.z = -0.5 * Math.PI;
   	circ.position.y = 6;
   	circ.visible= false;
   	scene.add(circ);
   	shot_target_mesh = createMesh(new THREE.PlaneGeometry(14, 6, 1, 1), {color: 0xffffff});
   	shot_target_mesh.material.transparent = true;
   	shot_target_mesh.material.opacity = 0.1;
   	shot_target_mesh.position.y = 3;
   	shot_target_mesh.position.x = 90;
   	shot_target_mesh.rotation.y = -0.5 * Math.PI;
   	shot_target_mesh.name = "shot_target";
   	scene.add(shot_target_mesh);
   	
   	da_obj['scene'] = scene;
   	da_obj['player_y'] = 2.5; //player y center
   	da_obj['player_j_y'] = 4; //jump hight
   	da_obj['ball'] = ball_mesh;
   	
   	intersectObjectsList.push(plane_mesh); 	 
   	intersectObjectsList.push(shot_target_mesh);   	
   	
   	var loader = new THREE.JSONLoader();
   	var frames = [];
    camera.position = param.camera_pos;
    camera.lookAt(scene.position);
    render();
    
    function render() {
    	var delta = clock.getDelta();
    	renderer.render(scene, camera);
    	requestAnimationFrame(render);

    }
}
