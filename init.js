//https://rawgit.com/doctorjay66/test03/master/digi_rep02a.html
var camera, scene, renderer, plane, ball, user_data = {}, shot_target_mesh, user_action,
    START_PLAYING = false, PLAYER_Y=4.5, BALL_Y = 0.3, PLAYERS = {}, set_action_phase = false, 
    mouse = new THREE.Vector2(), offset = new THREE.Vector3(), dest_point, head_point, j_dir = new THREE.Vector3(0,1,0),
    unit_meter = 4.0, shot_target_ratio = 2.70/7, clock = new THREE.Clock();
    /*j_dest, mixer_kick, mixer_run, mixer_jump, mixer_save,
    clip_kick, clip_run, clip_jump, clip_save,
    action_save, action_kick, action_run,
    READY=1, WAIT=0, OVER=-1, action_list = [], 
    keyboard = new KeyboardState(), up_pressed, running, waiting_action=[],
    START=1, STOP=0, KICK=3, RUN=2, MOVE=4, SHOOT=5, PASS=6, CROSS=7, CROSS_HEAD=8,
    INTERSECTED, LAST_SELECTED, SELECTED, SELECTED_PLAYER,
    */
    
function init() {
    /*document.addEventListener('mousedown', onDocumentMouseDown, false);
    document.addEventListener('mousemove', onDocumentMouseMove, false );
    document.addEventListener('mouseup', onDocumentMouseUp, false );
    gui = new DigiRepGui();*/
    create_scene();
    animate();
}

/*function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );
}

function onKeyPressed(event) {
    console.log(event.detail.action_sel);
}*/


function animate() {
    requestAnimationFrame( animate, renderer.domElement );
    var delta = clock.getDelta();
    renderer.render( scene, camera );
}
