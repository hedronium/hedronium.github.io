$(function(){
	var win = $(window);
	var win_height = win.height();
	var win_width = win.width();

	var scene = new THREE.Scene();
	var camera = new THREE.PerspectiveCamera(90, win_width/win_height, 5, 500);
	camera.position.z = 100;
	camera.position.y = 100;
	camera.position.x = 0;

	var axes = new THREE.AxisHelper(600);
	scene.add(axes);

	var renderer = new THREE.WebGLRenderer({
		'precision': 'highp',
		'alpha': true,
		'antialias': true,
		'maxLights': 10
	});

	var init = function(){
		win_height = win.height();
	    win_width = win.width();

		renderer.setSize(win_width, win_height);
		camera.aspect = win_width/win_height;
	}

	init();

	var angl = {
		e15: Math.PI/12,
		e30: Math.PI/6,
		e45: Math.PI/4,
		e60: Math.PI/3,
		e90: Math.PI/2,
	};

	var side_length = 80;
	var sphere_radius = 10;
	var cylinder_radius = 4;
	var cyclo_radius = (side_length/2)/Math.cos(angl.e30);
	var side_offset = Math.sqrt(Math.pow(cyclo_radius, 2) - Math.pow((side_length/2), 2));
	var side_vert_offset = side_offset*Math.cos(angl.e60);
	var side_hori_offset = side_offset*Math.sin(angl.e60);
	var triangle_height = Math.sqrt(Math.pow(side_length, 2) - Math.pow((side_length/2), 2));


	///////////////////////// MATERIALS /////////////////////////

	var main_mat = new THREE.MeshLambertMaterial({
		color: 0xffffff,
		shading: 'smooth',
		wireframe: true,
		wireframeLinewidth: 3
	});

	///////////////////// END - MATERIALS ///////////////////////
	// ------------------------------------------------------- //
	///////////////////////// GEOMETRY //////////////////////////

	var sphere_geo = new THREE.SphereGeometry(sphere_radius, 50, 50);
	var cylinder_geo = new THREE.CylinderGeometry(cylinder_radius, cylinder_radius, side_length, 50);

	//////////////////////// END - GEOMETRY /////////////////////
	// ------------------------------------------------------- //
	/////////////////////////  MESHES  //////////////////////////

	var low_bot_ball_a = new THREE.Mesh(sphere_geo, main_mat);
	low_bot_ball_a.position.z = -1*(triangle_height-side_offset);
	low_bot_ball_a.position.y = 0;
	low_bot_ball_a.position.x = 0;
	scene.add(low_bot_ball_a);

	var low_bot_ball_b = new THREE.Mesh(sphere_geo, main_mat);
	low_bot_ball_b.position.z = side_offset;
	low_bot_ball_b.position.y = 0;
	low_bot_ball_b.position.x = -1*(side_length/2);
	scene.add(low_bot_ball_b);

	var low_bot_ball_c = new THREE.Mesh(sphere_geo, main_mat);
	low_bot_ball_c.position.z = side_offset;
	low_bot_ball_c.position.y = 0;
	low_bot_ball_c.position.x = side_length/2;
	scene.add(low_bot_ball_c);

	// var low_top_ball_d = new THREE.Mesh(sphere_geo, main_mat);

	var low_bot_beam_ab = new THREE.Mesh(cylinder_geo, main_mat);
	low_bot_beam_ab.rotation.x = angl.e90;
	low_bot_beam_ab.rotation.y = 0;
	low_bot_beam_ab.rotation.z = angl.e30;

	low_bot_beam_ab.position.x = -1*side_hori_offset;
	low_bot_beam_ab.position.y = 0;
	low_bot_beam_ab.position.z = -1*side_vert_offset;

	scene.add(low_bot_beam_ab);



	var low_bot_beam_bc = new THREE.Mesh(cylinder_geo, main_mat);
	low_bot_beam_bc.rotation.x = angl.e90;
	low_bot_beam_bc.rotation.y = 0;
	low_bot_beam_bc.rotation.z = angl.e90;

	low_bot_beam_bc.position.x = 0;
	low_bot_beam_bc.position.y = 0;
	low_bot_beam_bc.position.z = side_offset;

	scene.add(low_bot_beam_bc);



	var low_bot_beam_ca = new THREE.Mesh(cylinder_geo, main_mat);
	low_bot_beam_ca.rotation.x = angl.e90;
	low_bot_beam_ca.rotation.y = 0;
	low_bot_beam_ca.rotation.z = -1*angl.e30;

	low_bot_beam_ca.position.x = 1*side_hori_offset;
	low_bot_beam_ca.position.y = 0;
	low_bot_beam_ca.position.z = -1*side_vert_offset;

	scene.add(low_bot_beam_ca);

	// var low_bot_beam_ad = new THREE.Mesh(cylinder_geo, main_mat);
	// var low_bot_beam_bd = new THREE.Mesh(cylinder_geo, main_mat);
	// var low_bot_beam_cd = new THREE.Mesh(cylinder_geo, main_mat);


	////////////////////////  END - MESHES  /////////////////////
	// ------------------------------------------------------- //
	///////////////////////// LIGHTS ////////////////////////////

	var ambient_light = new THREE.AmbientLight(0xE3E3E3);
	scene.add(ambient_light);

	var directional_light = new THREE.DirectionalLight( 0xffffff, 0.2 ); 
	directional_light.position.set( 0, 1, 0 ); 
	scene.add(directional_light);

	//////////////////////  END - LIGHTS  ///////////////////////





	camera.lookAt(scene.position);

	win.resize(function(){
		init();
		renderer.render(scene, camera);
	});

	$("#target").append(renderer.domElement);
	renderer.render(scene, camera);
});