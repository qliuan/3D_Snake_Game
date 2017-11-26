//----- GLOBAL VARIABLES -----//
// Game variables
var STEP = 10;

var headXSpeed = STEP, headYSpeed = 0;
var score = 0;
var difficulty = 1.0; // 1.0 normal, >1.0 increase speed, <1.0 decrease speed
var poleNum = Math.ceil(Math.pow(difficulty,4)*2);
var MAX_SCORE = Math.ceil(5*difficulty);
var WIN = false, LOSE = false;

// Scene and objects
var renderer, camera, scene;
var WIDTH = 800,HEIGHT = 450;
var VIEW_ANGLE = 90, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var groundPlane, PXplane, NXplane, PYplane, NYplane, PZplane;
var head, diamond;
var body = [];
var poles = [];
var bodyLength = 5;

var sun, headLantern, diamondLantern, ambientLight;
var bodyUnit;

var startPosition = [0, 0, STEP/2];

var loader = new THREE.OBJLoader();

// Create camera
function createCamera()
{
	camera =
		new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	camera.position.x = startPosition[0] - STEP*5;
	camera.position.y = startPosition[1];
	camera.position.z = startPosition[2] + STEP*3;

	camera.rotation.order = 'YXZ';

	camera.rotation.x = -120 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;
}

// Create plane
var	planeQuality = 10;
var planeWidth = 1024;//100*STEP;
var planeHeight = 1024;//50*STEP;
var groundPlaneMaterial, PXplaneMaterial, NXplaneMaterial, PYplaneMaterial, NYplaneMaterial, PZplaneMaterial;

function createPlane()
{
	groundPlane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),
		groundPlaneMaterial);

	groundPlane.receiveShadow = true;
	groundPlane.castShadow = true;

	PXplane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight/2,
		planeQuality,
		planeQuality),
		PXplaneMaterial);

	PXplane.rotation.x = 90 * Math.PI/180;
	PXplane.rotation.y = -90 * Math.PI/180;
	PXplane.position.x = planeWidth / 2;
	PXplane.position.z = planeHeight / 32;

	PXplane.receiveShadow = true;
	PXplane.castShadow = true;

	NXplane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight/2,
		planeQuality,
		planeQuality),
		NXplaneMaterial);

	NXplane.rotation.x = 90 * Math.PI/180;
	NXplane.rotation.y = 90 * Math.PI/180;
	NXplane.position.x = -planeWidth / 2;
	NXplane.position.z = planeHeight / 32;

	NXplane.receiveShadow = true;
	NXplane.castShadow = true;

	PYplane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight/2,
		planeQuality,
		planeQuality),
		PYplaneMaterial);

	PYplane.rotation.x = 90 * Math.PI/180;
	PYplane.position.y = planeHeight / 2;
	PYplane.position.z = planeHeight / 32;

	PYplane.receiveShadow = true;
	PYplane.castShadow = true;

	NYplane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight/2,
		planeQuality,
		planeQuality),
		NYplaneMaterial);

	NYplane.rotation.x = 90 * Math.PI/180;
	NYplane.rotation.y = 180 * Math.PI/180;
	NYplane.position.y = -planeHeight / 2;
	NYplane.position.z = planeHeight / 32;

	NYplane.receiveShadow = true;
	NYplane.castShadow = true;

	PZplane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),
		PZplaneMaterial);

	PZplane.rotation.x = 180 * Math.PI/180;
	// PZplane.rotation.z = 180 * Math.PI/180;
	PZplane.position.z = planeHeight / 4;

	// PZplane.receiveShadow = true;
	// PZplane.castShadow = true;

}

// Create body
var bodyMaterial =
	new THREE.MeshStandardMaterial( {
	    color: 0x8ec0f2,
	    roughness: 0.10,
	    metalness: 0.60,
	} );


	function newBodyBlock(x, y, z)
	{
		loader.load(
			// resource URL
			'obj/cube_bumpy.obj',
			// called when resource is loaded
			function ( unit ) {
				unit.position.x = x;
				unit.position.y = y;
				unit.position.z = z;
				body.push(unit);
				scene.add(unit);
			},
			// called when loading is in progresses
			function ( xhr ) {
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
			},
			// called when loading has errors
			function ( error ) {
				console.log( 'An error happened' );
			}
			);

	}

// Create head
var headRadius = STEP/2,
	headSegments = 32,
	headRings = 32;

var headMaterial =
	new THREE.MeshStandardMaterial( {
	    /*color: 0x8ec0f2,
	    roughness: 0.42,
	    metalness: 0.37,*/
	    color: 0x8ec0f2,
	    roughness: 0.10,
	    metalness: 0.60,
	} );
var sphere_noisy;
var screwdriver;
function createHead()
{
	// var cube = new THREE.CubeGeometry(STEP, STEP, STEP);
	// var headCsg = new ThreeBSP(cube);
	//
	// var boxScale = STEP/4;
	// var trans = STEP/2 - boxScale/2;
	// var boxPos = [ [-trans, trans, 0], [-trans, -trans, 0] ];
	// for (var i=0; i<2; i++)
	// {
	// 	var box = new THREE.BoxGeometry( boxScale, boxScale, STEP);
	// 	box.translate(boxPos[i][0],boxPos[i][1],boxPos[i][2]);
	// 	var boxCsg = new ThreeBSP(box);
	// 	headCsg = headCsg.subtract(boxCsg);
	// }
	//
	// var cylinder = new THREE.CylinderGeometry(STEP/8, STEP/8, STEP/2, 32);
	// cylinder.translate(0*STEP/4,-4*STEP/4,0*STEP);
	// cylinder.rotateX(-90 * Math.PI/180);
	// var cylinderCsg = new ThreeBSP(cylinder);
	//
	// var eye = new THREE.SphereGeometry(STEP/4, 32, 32);
	// eye.translate(0*STEP/4,0*STEP/4,5*STEP/4);
	// eyeCsg = new ThreeBSP(eye);
	//
	// headCsg = headCsg.union(cylinderCsg);
	// headCsg = headCsg.union(eyeCsg);

	/*cylinder.translate(0,-STEP/2,0);
	cylinderCsg = new ThreeBSP(cylinderCsg);

	eye.translate(0,-STEP/2,0);
	eyeCsg = new ThreeBSP(eyeCsg);

	headCsg = headCsg.union(cylinderCsg);
	headCsg = headCsg.union(eyeCsg);*/

	// head = headCsg.toMesh(headMaterial);

	// bodyBlock.position.x = startPosition[0] - STEP - i * STEP;
	// bodyBlock.position.y = startPosition[1];
	// bodyBlock.position.z = startPosition[2];
	// bodyBlock.scale = [STEP, STEP, STEP];
	// bodyUnit = bodyBlock;
	// scene.add(bodyBlock);
	//
	// body.push(bodyBlock);

	loader.load(
	// resource URL
	'obj/sphere_noisy.obj',
	// called when resource is loaded
	function ( obj ) {
		sphere_noisy = obj.children[0].geometry;
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
	);
	loader.load(
	// resource URL
	'obj/screwdriver.obj',
	// called when resource is loaded
	function ( obj ) {
		screwdriver = obj.children[0].geometry;
	},
	// called when loading is in progresses
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
	);
	var sphereGeometry = sphere_noisy;
	var screwdriverGeometry1 = screwdriver;
	var screwdriverGeometry2 = screwdriver;
	screwdriverGeometry2.rotateX(-90 * Math.PI/180);
	var sphere_noisyCsg = new ThreeBSP(sphereGeometry);
	var screwdriverCsg1 = new ThreeBSP(screwdriverGeometry1);
	var screwdriverCsg2 = new ThreeBSP(screwdriverGeometry2);
	var head = sphere_noisyCsg.union(screwdriverCsg1).union(screwdriverCsg2).toMesh(diamondMaterial);
	head.receiveShadow = true;
	head.castShadow = true;
}


// Create diamond
function createDiamond()
{
 var geometry1 = new THREE.CylinderGeometry( 1, STEP, STEP, 4 );
 var geometry2 = new THREE.CylinderGeometry( 1, STEP, STEP, 4 );

 geometry2.translate(0, STEP, 0);

 geometry2.rotateX(180 * Math.PI/180);

 var cylinder1 = new ThreeBSP(geometry1);
 var cylinder2 = new ThreeBSP(geometry2);

	var cylinder = cylinder1.union(cylinder2);

 diamond = cylinder.toMesh(diamondMaterial);

 diamond.rotation.x = 90 * Math.PI/180;
 diamond.position.z = STEP * 2;

}


// Create head lantern
function createHeadLantern()
{
	headLantern = new THREE.PointLight(0xffffff);
	headLantern.position.set(head.position.x, head.position.y, head.position.z + STEP * 3);
	headLantern.intensity = 1; //3
	headLantern.castShadow = true;

}

// Create diamond lantern
function createDiamondLantern()
{
	/*diamondLantern = new THREE.SpotLight(0xffffff);
	diamondLantern.position.set(diamond.position.x, diamond.position.y, diamond.position.z + STEP * 5);
	diamondLantern.intensity = 5;
	diamondLantern.castShadow = true;

	diamondLantern.target = diamond;
	diamondLantern.angle = Math.PI/6;*/

	diamondLantern = new THREE.PointLight(0xffffff);
	diamondLantern.position.set(diamond.position.x, diamond.position.y, diamond.position.z + STEP * 3);
	diamondLantern.intensity = 0.25;
	diamondLantern.distance = STEP * 300;
	diamondLantern.decay = 2;

	diamondLantern.castShadow = true;
}

// Create sun
var sunRadius = 500;
function createSun()
{
	sun = new THREE.SpotLight(0xe2ec4a);
	sun.position.set(0, -sunRadius, 0);
	sun.intensity = 1.0;
	sun.castShadow = true;
}

// Create light
function createAmbientLight() {
	scene.background = new THREE.Color( 0xaaaaaa );
	scene.fog = new THREE.Fog( 0xf2f7ff, 1, 25000 );
	scene.add( new THREE.AmbientLight( 0x47484c ) );

	ambientLight = new THREE.DirectionalLight(0xe2ec4a, 0.1);
	ambientLight.position.set(0, 0, sunRadius);
	ambientLight.target = groundPlane;
	ambientLight.castShadow = true;
	scene.add(ambientLight);
}

// Create poles
var polesTexture;
var polesMaterial;
var diamondTexture;
var diamondMaterial;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function newPole()
{
	var pole = new THREE.Mesh(
			new THREE.CylinderGeometry( STEP/2, STEP/2, 20*STEP, 32),
			polesMaterial);

	var x = 0, y = 0, z = STEP/2;
	var isValid = false;
	while (!isValid)
	{
		// Set the random position
		x = getRandomInt(-planeWidth/2, planeWidth/2);
		y = getRandomInt(-planeHeight/2, planeHeight/2);
		x -= x % STEP;
		y -= y % STEP;

		// Check whether it collides with other objects
		if (head.position.x == x && head.position.y == y)
		{
			continue; // Get new random positions
		}

		if (diamond.position.x == x && diamond.position.y == y)
		{
			continue;
		}

		for (var i=0; i<body.length; i++)
		{
			if (body[i].position.x == x && body[i].position.y == y)
			{
				continue; // Get new random positions
			}
		}

		isValid = true;
	}

	pole.position.x = x;
	pole.position.y = y;
	pole.position.z = z;

	pole.rotation.x = -90 * Math.PI/180;

	pole.receiveShadow = true;
	pole.castShadow = true;

	return pole;
}


function loadTexture() {
	var textureLoader = new THREE.TextureLoader();
	var maxAnisotropy = renderer.getMaxAnisotropy();
	var groundTexture = textureLoader.load( "textures/planes/nz.jpg" );
	/*var texture = textureLoader.load( "https://github.com/mrdoob/three.js/blob/master/examples/textures/crate.gif" );*/
	groundPlaneMaterial = new THREE.MeshPhongMaterial( { map: groundTexture } );
	groundTexture.anisotropy = maxAnisotropy;
	// groundTexture.wrapS = groundTexture.wrapT = THREE.RepeatWrapping;
	// groundTexture.repeat.set( 20, 20 );

	var PXtexture = textureLoader.load( "textures/planes/px.jpg" );
	PXplaneMaterial = new THREE.MeshLambertMaterial( { map: PXtexture } );
	PXtexture.anisotropy = maxAnisotropy;

	var NXtexture = textureLoader.load( "textures/planes/nx.jpg" );
	NXplaneMaterial = new THREE.MeshLambertMaterial( { map: NXtexture } );
	NXtexture.anisotropy = maxAnisotropy;

	var PYtexture = textureLoader.load( "textures/planes/py.jpg" );
	PYplaneMaterial = new THREE.MeshLambertMaterial( { map: PYtexture } );
	PYtexture.anisotropy = maxAnisotropy;

	var NYtexture = textureLoader.load( "textures/planes/ny.jpg" );
	NYplaneMaterial = new THREE.MeshLambertMaterial( { map: NYtexture } );
	NYtexture.anisotropy = maxAnisotropy;

	var PZtexture = textureLoader.load( "textures/planes/pz.jpg" );
	PZplaneMaterial = new THREE.MeshLambertMaterial( { map: PZtexture } );
	PZtexture.anisotropy = maxAnisotropy;


	diamondTexture = textureLoader.load( "textures/diamond.png" );
	diamondMaterial =
	new THREE.MeshPhongMaterial(
	{
		color: 0xffffff,
		map: diamondTexture
	});
	diamondTexture.anisotropy = maxAnisotropy;
	diamondTexture.wrapS = diamondTexture.wrapT = THREE.RepeatWrapping;
	// diamondTexture.repeat.set(5, 1);

	polesTexture = textureLoader.load( "textures/rock.jpg" );
	polesMaterial =
	new THREE.MeshPhongMaterial(
	{
		color: 0xffffff,
		map: polesTexture
	});
	polesTexture.anisotropy = maxAnisotropy;
	polesTexture.wrapS = polesTexture.wrapT = THREE.RepeatWrapping;
	polesTexture.repeat.set(5, 1);
}


function setup()
{
	createScene();
	draw();
}


function createScene()
{
	createCamera();

	scene = new THREE.Scene();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);

	document.getElementById("gameCanvas").appendChild(renderer.domElement);


	loadTexture();

	createPlane();
	scene.add(groundPlane);
	scene.add(PXplane);
	scene.add(NXplane);
	scene.add(PYplane);
	scene.add(NYplane);
	scene.add(PZplane);



	for (var i = 0; i < bodyLength; ++i) {
		newBodyBlock(startPosition[0] - STEP - i * STEP, startPosition[1], startPosition[2]);
	}

	createHead();
	scene.add(head);

	head.position.x = startPosition[0];
	head.position.y = startPosition[1];
	head.position.z = startPosition[2];

	createDiamond();
	trickDiamond();

	scene.add(diamond);

	createHeadLantern();
	scene.add(headLantern);

	createDiamondLantern();
	/*scene.add(diamondLantern);*/

	createSun();
	scene.add(sun);

	createAmbientLight();

	for (var i = 0; i < poleNum; ++i) {
		var pole = newPole();
		poles.push(pole);
		scene.add(pole);
	}

	// MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
	renderer.shadowMapEnabled = true;

	console.log(scene);
}

function updateLight() {
	sun.position.y = sunRadius * Math.sin(time/30);
	sun.position.z = sunRadius * Math.cos(time/30);

	headLantern.position.set(head.position.x, head.position.y, head.position.z + STEP * 3);
	diamondLantern.position.set(head.position.x, head.position.y, head.position.z + STEP * 3);
}

var fps = 15 * difficulty;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

var time = 0;

function draw()
{
	requestAnimationFrame(draw);
	if (!WIN && !LOSE)
	{
		now = Date.now();
		delta = now - then;

		if (delta > interval) {

			then = now - (delta % interval);
			delta = delta % interval;

			renderer.render(scene, camera);
			headMovement();
			checkDiamond();
			bodyMovement();
			// headLantern.target = diamond;
			diamond.rotation.y += 0.2;
			updateCamera();
			updateLight();
			time++;
			checkEndingCondition();

			if (sun.position.z < 0) {
				scene.remove(sun);
			}
			else {
				scene.add(sun);
			}
		}

	}
	else if (WIN)
	{
		gameWin();
		restart();
	}
	else
	{
		gameLose();
		restart();
	}

}
