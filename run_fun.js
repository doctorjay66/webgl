var run_fun = {'run':run, 'kickr':kick_action, 'move':move, 'cross':cross, 'save':save, 'jump':jump};

function executeIfReady(a, delta) {
    if(a.state == READY) {
        run_fun[a.name](a, delta);
    }

}

function kick_action(a, delta) {
	a.elapsed_time += delta;
	if(!a.is_playing) {
		rotate_mash(a.mesh,0,z_orient.angleTo(a.dir));
		a.mesh.animations[a.name].play(0, 1.0);
		a.is_playing = true;
	}
	if(a.elapsed_time > 1.8) {
	    a.mesh.animations[a.name].stop();
	    a.state = OVER;
	    a.mesh.action = a.id;
	    a.mesh.dispatchEvent({type:'end'});	
	}
	//console.log(a.name);
}

function run(a, delta) {
	a.elapsed_time += delta;
	if(!a.is_playing) {
		rotate_mash(a.mesh,0,z_orient.angleTo(a.dir));
		a.mesh.animations[a.name].play(0, 1.0);
		a.is_playing = true;
	}
    if(arriveTo(a.mesh.position, a.dest, d=2.0)) {
        setEnd(a);
        a.mesh.animations[a.name].stop();
    } else {
        move_mash(a.mesh, a.dir, a.speed, delta);
    }
}

function cross(a, delta) {
    move_spline(a, delta);
    if(a.step > 1){
       	setEnd(a);
   	}
}

function move(a, delta) {
    if(arriveTo(a.mesh.position, a.dest, d=3.5)) {
        setEnd(a);
    } else {
        move_mash(a.mesh, a.dir, a.speed, delta);
    }
}

function jump(a, delta) {
	if(!a.is_playing) {
		a.mesh.animations[a.name].play(0, 1.0);
		rotate_mash(a.mesh,0,z_orient.angleTo(direction(j_dest, a.dest)));
		a.is_playing = true;
	}
	if(arriveTo(a.mesh.position, head_point, d=2.0)) {
	    a.mesh.animations[a.name].stop();
	    setEnd(a);
	} else {
	    move_mash(a.mesh, a.dir, a.speed, delta);
	}
}

function save(a, delta) {
	a.elapsed_time += delta;
	if(!a.is_playing) {
		a.mesh.animations[a.name].play(0, 1.0);
		//dummy.rotation.y = Math.PI / 3;
		var shoot_dir = direction(SELECTED_PLAYER.position, goal_center);
		var save_angle = gk_orient.angleTo(shoot_dir);
		save_angle = SELECTED_PLAYER.position.z < 0 ? -save_angle : save_angle;
		console.log(save_angle);
		rotate_mash(dummy,0,save_angle);
		a.is_playing = true;
	}
	if(a.elapsed_time > 1.5) {
	    a.mesh.animations[a.name].stop();
	    console.log(a.name);
	    a.state = OVER;
	    a.mesh.action = a.id;
	    a.mesh.dispatchEvent({type:'end'});	
	}
}

function move_spline(a, delta) {
    a.step += delta * a.speed;
    a.mesh.position.x = a.spline.getPoint(a.step).x
    a.mesh.position.y = a.spline.getPoint(a.step).y;
    a.mesh.position.z = a.spline.getPoint(a.step).z;
}

var arriveTo = function(from, to, d=0.3) {
	//console.log(from.distanceTo(to));
	//console.log(from);
	//console.log(to);
	if(from.distanceTo(to) < d) {
		//console.log(true);
		return true;
	} else {
		return false;
	}
};

function move_mash(mesh, dir, speed, delta) {    
    mesh.position.x += dir.x * speed * delta;
    mesh.position.y += dir.y * speed * delta;
    mesh.position.z += dir.z * speed * delta;
}

function rotate_mash(mesh, angle_x=0, angle_y=0, angle_z=0) {
    mesh.rotateX(angle_x);
    mesh.rotateY(angle_y);
    mesh.rotateZ(angle_z);
}

function setEnd(a) {
    a.state = OVER;
    a.mesh.position.x = a.dest.x;
    a.mesh.position.y = a.dest.y;
    a.mesh.position.z = a.dest.z;
    a.mesh.action = a.id;
    a.mesh.dispatchEvent({type:'end'});	//rise an action end event
    //console.log(a.name, a.state);
}
