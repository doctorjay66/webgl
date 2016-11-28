var run_fun = {'run':move_mash, 'kickr':kick_action};

function executeIfReady(a, delta) {
    if(a.state == READY) {
        run_fun[a.name](a, delta);
    }

}

function kick_action(a, delta) {
	a.elapsed_time += delta;
	if(!a.is_playing) {
		a.mesh.animations[a.name].play(0, 1.0);
		a.is_playing = true;
	}
	//console.log(a.name);
}

function move_mash(mesh, dir, speed, delta) {    
    mesh.position.x += dir.x * speed * delta;
    mesh.position.y += dir.y * speed * delta;
    mesh.position.z += dir.z * speed * delta;
}
