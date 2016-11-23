THREE.PlayerChar = function () {

	this.animations = {};
	
	this.load = function ( url, pos, rot, onLoad, color ) {
	
		var scope = this;

		var loader = new THREE.JSONLoader();
		loader.load( url, function( geometry, materials ) {
			var mat = new THREE.MeshLambertMaterial( { color: color /*0xFF0000*/, skinning: true } );
			THREE.SkinnedMesh.call(scope, geometry, mat);
			
			/*for ( var i = 0; i < geometry.animations.length; ++i ) {

				var animName = geometry.animations[ i ].name;
				scope.animations[ animName ] = new THREE.Animation( scope, geometry.animations[ i ] );

			}*/
			
			if ( onLoad !== undefined ) onLoad(scope, pos, rot);

		} );

	};
};

THREE.PlayerChar.prototype = Object.create( THREE.SkinnedMesh.prototype );

THREE.PlayerChar.prototype.getForward = function() {

	var forward = new THREE.Vector3();

	return function() {

		// pull the character's forward basis vector out of the matrix
		forward.set(
			-this.matrix.elements[ 8 ],
			-this.matrix.elements[ 9 ],
			-this.matrix.elements[ 10 ]
		);

		return forward;
	}
}

