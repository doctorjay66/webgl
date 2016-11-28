function createUserAction(/*user_action*/) {
    
    if(user_action == SHOOT) {
        var a = {};
        //console.log(a);
        setAction(a, {'name':'kickr', 'mesh':SELECTED_PLAYER, 'dest':dest_point, 'state':READY, 
                      'd_source':ball.position/*, 'to_activate':[1], 'when_activate':'now'*/});
        
        var a = {};
        var b_dest = new THREE.Vector3(0,0,0);
        b_dest.copy(dest_point);
        //b_dest.y = BALL_Y;//mid_spline_point.add(dist_vect.divideScalar(2));
        setAction(a, {'name':'move', 'mesh':ball, 'dest':b_dest, 'state':WAIT, 
                      'd_source':ball.position, speed:30});
        addStartActionEvent('end', action_list[a.id-1], a/*, action_list*/);
        
        /*var a = {};
        var s_dest = new THREE.Vector3(0,0,0);
        var s_dest1 = new THREE.Vector3(0,0,0);
        //s_dest.copy(dest_point);
        var s_dir = direction(dest_point, PLAYERS['save'].position);
        s_dir.multiplyScalar(4);
        console.log(s_dir);
        s_dest1.copy(PLAYERS['save'].position);
        s_dest1.add(s_dir);
        console.log(s_dest1);
        setAction(a, {'name':'save', 'mesh':PLAYERS['save'], 'dest':s_dest1, 'state':WAIT, 
                      'd_source':PLAYERS['save'].position, speed:20});
        addStartActionEvent('end', action_list[a.id-2], a);*/    
    } else if(user_action == PASS) {
        var a = {};        
        setAction(a, {'name':'kickr', 'mesh':SELECTED_PLAYER, 'dest':dest_point, 'state':READY, 
                      'd_source':ball.position/*, 'to_activate':[1,2], 'when_activate':'now'*/});
        
        var a = {};
        var b_dest = new THREE.Vector3(0,0,0);
        b_dest.copy(dest_point);
        b_dest.y = BALL_Y;
        setAction(a, {'name':'move', 'mesh':ball, 'dest':b_dest, 'state':WAIT, 
                      'd_source':ball.position, speed:10});
        addStartActionEvent('end', action_list[a.id-1], a/*, action_list*/);
        
        var a = {};
        var p_dest = new THREE.Vector3(0,0,0);
        p_dest.copy(dest_point);
        p_dest.y = PLAYER_Y;
        setAction(a, {'name':'run', 'mesh':PLAYERS['p2'], 'dest':p_dest, 'state':WAIT, 
                      'd_source':PLAYERS['p2'].position, speed:10});
        addStartActionEvent('end', action_list[a.id-2], a/*, action_list*/);
    } else if(user_action == CROSS) {
        var a = {};
        setAction(a, {'name':'kickr', 'mesh':SELECTED_PLAYER, 'dest':dest_point, 'state':READY, 
                      'd_source':ball.position/*, 'to_activate':[1,2], 'when_activate':'now'*/});
		setCrossAction();
        var a = {};
        var p_dest = new THREE.Vector3(0,0,0);
        p_dest.copy(dest_point);
        p_dest.y = PLAYER_Y;
        setAction(a, {'name':'run', 'mesh':PLAYERS['p2'], 'dest':p_dest, 'state':WAIT, 
                      'd_source':PLAYERS['p2'].position, speed:10});
        addStartActionEvent('end', action_list[a.id-2], a/*, action_list*/);
    } else if(user_action == CROSS_HEAD) {
        var a = {};
        setAction(a, {'name':'kickr', 'mesh':SELECTED_PLAYER, 'dest':dest_point, 'state':READY, 
                      'd_source':ball.position/*, 'to_activate':[1,2], 'when_activate':'now'*/});
		setCrossAction(true);
        var a = {};
        var p_dest = new THREE.Vector3(0,0,0);
        p_dest.copy(dest_point);
        p_dest.y = PLAYER_Y;        
        setAction(a, {'name':'run', 'mesh':PLAYERS['p2'], 'dest':p_dest, 'state':WAIT, 
                      'd_source':PLAYERS['p2'].position, speed:10, 'to_activate':[3], 'when_activate':'now'});
        addStartActionEvent('end', action_list[a.id-2], a/*, action_list*/);
        var a = {};
        j_dest = new THREE.Vector3(35*4-12,2,1);
        head_point = new THREE.Vector3(0,0,0);
        head_point.copy(p_dest);
        head_point.y = 8;
        console.log(head_point);
        setAction(a, {'name':'jump', 'mesh':PLAYERS['p2'], 'dest':head_point, 'state':WAIT, 
                      'd_source':p_dest, speed:2/*, 'to_activate':[4], 'when_activate':'1,end'*/});
        addStartActionEvent('end', action_list[a.id-1], a/*, action_list*/);
        var a = {};
        setAction(a, {'name':'move', 'mesh':ball, 'dest':j_dest, 'state':WAIT, 
                      'd_source':head_point, speed:2});
        addStartActionEvent('end', action_list[a.id-1], a/*, action_list*/);
    }
}

function setAction(a, p) {
	a.name = p.name;
	//console.log(a.name);
	a.mesh = p.mesh;
		//console.log(a.mesh);
	a.state = p.state
	a.is_playing = false;
	a.id = action_list.length;
	a.dest = p.dest;
	a.dir = direction(a.dest, p.d_source);
	a.speed = p.speed || 10;
	//a.to_activate = p.to_activate;
	//a.when_activate = p.when_activate;
	/*if(p.to_activate) { //actions to activate when this action is over
		a.active_list = [];
		for(var i=0;i<p.to_activate.length;i++) {
			a.active_list.push(p.to_activate[i]);
		}
	}*/
	a.elapsed_time = 0;
	action_list.push(a);
}

function setCrossAction(h) {
    var a = {}, 
        mid_spline_point = new THREE.Vector3(0, 0, 0), 
        dist_vect = new THREE.Vector3(0, 0, 0),
        dest = new THREE.Vector3(0,0,0);
    a.name = "cross";
    a.id = action_list.length;
    a.mesh = ball;
    dest.copy(dest_point); 
    if(h) {
    	dest.y = 10;
    } else {
    	dest.y = BALL_Y;
    }
    a.dest = dest;
    dist_vect.subVectors(dest, ball.position);
    mid_spline_point.add(ball.position);
    mid_spline_point.add(dist_vect.divideScalar(2));
    mid_spline_point.y = 12;
    a.spline = new THREE.SplineCurve3([ball.position, mid_spline_point, dest]);
    a.speed = 0.4;
    a.step = 0;
    a.state = WAIT;
    action_list.push(a);
    addStartActionEvent('end', action_list[a.id-1], a/*, action_list*/);
}

function direction(p1, p2) {
    var dir = new THREE.Vector3(0, 0, 0);

    dir.subVectors(p1, p2);
    dir.normalize();
    return dir;
}

function performEventHandler(e, esa, ta/*, action_list*/) {
	if(e=='end') {
   		console.log('end');    	
    		//ta.dir = direction(ta.dest, ta.mesh.position);//because friction overcome dest
    	ta.state = READY;
    	//console.log(ta.mesh);
    	/*if(ta.mesh.animations) {
	    	ta.mesh.animations[ta.name].play(0, 1.0);
	    }*/
	}
}

function addStartActionEvent(e, esa, ta/*, action_list*/) { //event, event start action, target action
    if(e == 'init') {
         //action_list[ta].status = 1;
         //ta.dir = direction(ta.dest, ta.mesh.position);
         console.log('init');
         ta.state = READY;
         //ta.mesh.animations[ta.name].play(0, 1.0);
    } else { 
        THREE.EventDispatcher.call(esa.mesh);
        //console.log(esa.mesh);
        esa.mesh.addEventListener(e, function(event) {
        //console.log(event);
                 if(esa.id == event.target.action) {
                 	performEventHandler(e, esa, ta/*, action_list*/);
                 }        
        });
    }
}
