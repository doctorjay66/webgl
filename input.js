function initGUI() {
    var gui = new dat.GUI();
    var controls = {
		shoot: function() {
		    set_action_phase = true;
		    user_action = SHOOT;
		},
		start_actions: function() {			
			if(!dest_point){alert('No Dest!');SELECTED_PLAYER.material.opacity = 1;return;}
			start = true;
			//console.log(mesh.geometry.animations);
			/*var a = {};			
			//mesh.animations['run'].play(0, 1.0);
			a.mesh = mesh;
			a.name = 'run';
			a.speed = 10;
			a.dest = dest_point;//new THREE.Vector3(15*4+20, 10, 0);
			//console.log(dest_point);
			a.dir = direction(a.dest, mesh.position);
			a.state = READY
			action_list.push(a);*/
			createUserAction();
			set_action_phase = false;
			SELECTED_PLAYER.material.opacity = 1;
		},
		stop_actions: function() {			
			start = false;
			//console.log(mesh.geometry.animations);
			//mesh.animations['run'].stop();
		}     
    };
    gui.add( controls, 'shoot' ).name("Tiro");
    gui.add( controls, 'start_actions' ).name("Start Action");
    gui.add( controls, 'stop_actions' ).name("Stop Action");
}

function movePLayerByKey(d) {
    keyboard.update();
	if ( keyboard.pressed("up") ) {
		up_pressed = true;
		SELECTED_PLAYER.translateZ(10*d);
	}
}

//var projector = new THREE.Projector();
function onDocumentMouseDown(event) {
    var intersects, raycaster;
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;	
    var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
    
    if(event.originalTarget.tagName != "CANVAS") return;
    if(SELECTED_PLAYER) {SELECTED_PLAYER.material.opacity = 1;}
    event.preventDefault();
    vector = vector.unproject(camera);
    raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );
    if(set_action_phase) { //select the field when in set action to assign a dest. point
		intersects = raycaster.intersectObjects( [ground/*, shot_target_mesh*/] );
		//console.log(intersects);
	} else {
		intersects = raycaster.intersectObjects( [PLAYERS['p1']/*, PLAYERS['p2']*/] );
	}
	if ( intersects.length > 0 ) {
	    if(set_action_phase) { //action dest. point
			dest_point = intersects[ 0 ].point;
			console.log(intersects[ 0 ].point);
			/*if(user_action == CROSS_HEAD && !has_clicked) { //set the head strike and head shoot dest.
			    head_point.copy(dest_point);               //the first click is for the strike point
			    has_clicked = true; //is the first click
			}*/
		} else {
		    SELECTED = intersects[ 0 ].object;
		    SELECTED_PLAYER = SELECTED;
		    LAST_SELECTED = SELECTED;
		    SELECTED_PLAYER.material.transparent = true;
		    SELECTED_PLAYER.material.opacity = 0.5;
		    intersects = raycaster.intersectObject( ground );
		    offset.copy( intersects[ 0 ].point ).sub( ground.position );
		}
	}
	
}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;			

	var vector = new THREE.Vector3( mouse.x, mouse.y, 0.5 );
				//projector.unprojectVector( vector, camera );
	vector = vector.unproject(camera);

	var raycaster = new THREE.Raycaster( camera.position, vector.sub( camera.position ).normalize() );

	if ( SELECTED ) {
		var intersects = raycaster.intersectObject( ground );
					//SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );
		SELECTED.position.copy( intersects[ 0 ].point);
		SELECTED.position.y = 4.5;					
		return;

	}    
 
    var intersects = raycaster.intersectObjects( [PLAYERS['p1']/*, PLAYERS['p2']*/]  );
	if ( intersects.length > 0 ) {
		if ( INTERSECTED != intersects[ 0 ].object ) {
			INTERSECTED = intersects[ 0 ].object;
		}
	} else {
			INTERSECTED = null;
	}	
}

function onDocumentMouseUp( event ) {
	event.preventDefault();
	if ( INTERSECTED ) {
		SELECTED = null;
	}     
}

