//----- GLOBAL VARIABLES -----//
// Game variables
var STEP = 3;

var headXSpeed = STEP, headYSpeed = 0;
var score = 0;
var difficulty = 0.5; // 1.0 normal, >1.0 increase speed, <1.0 decrease speed
var MAX_SCORE = 10;
var WIN = false, LOSE = false;

// Scene and objects
var renderer, camera, scene;
var WIDTH = 640,HEIGHT = 360;
var VIEW_ANGLE = 90, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var plane;
var head;
var diamond;
var body = [];
var bodyLength = 5;

var sun, lantern;

var loader = new THREE.OBJLoader();


var startPosition = [0, 0, STEP/2];


// Create plane
var	planeQuality = 10;
var planeWidth = 1280;
var planeHeight = 720;
var planeMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0x4BD121
	});

function createPlane()
{
	plane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),
		planeMaterial);

	plane.receiveShadow = true;
	plane.castShadow = true;
}

// Create body
var bodyMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0x1B32C0
	});


function newBodyBlock()
{
	var bodyBlock = new THREE.Mesh(
			new THREE.CubeGeometry(
			STEP,
			STEP,
			STEP,
			1,
			1,
			1),
			bodyMaterial);

	return bodyBlock;
}

// Create head
var headRadius = STEP/2,
	headSegments = 6,
	headRings = 6;

var headMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0xD43001
	});

function createHead()
{
	head = new THREE.Mesh(
		new THREE.SphereGeometry(
		headRadius,
		headSegments,
		headRings),
		headMaterial);

	head.receiveShadow = true;
	head.castShadow = true;
}


// Create diamond
function createDiamond()
{
	var diamondMaterial =
		new THREE.MeshNormalMaterial({
			shading: THREE.SmoothShading
		});

	var sphereRadius = STEP/2,
		sphereSegments = 6,
		sphereRings = 6;
	var sphere = new THREE.Mesh(
		new THREE.SphereGeometry(
			sphereRadius,
			sphereSegments,
			sphereRings),
			diamondMaterial);
	sphere.position.z = STEP;

	/*var sphereCsg = THREE.CSG.toCSG(sphere);*/

	diamond = new THREE.Mesh( new THREE.CubeGeometry( STEP, STEP, STEP ), diamondMaterial );
	/*var cubeCsg = THREE.CSG.toCSG(cubeMesh);*/

	/*var diamondCsg = cubeCsg.union(sphereCsg);
	diamond = THREE.CSG.fromCSG(diamondCsg);*/

	/*THREE.GeometryUtils.merge(diamond, sphere);*/

}

// Create sun
var sunRadius = 5000;

function setup()
{
	createScene();
	draw();
}

function createScene()
{
	camera =
		new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	camera.position.x = startPosition[0] - STEP*3;
	camera.position.y = startPosition[1];
	camera.position.z = startPosition[2] + STEP*5;

	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;

	scene = new THREE.Scene();
	scene.add(camera);

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);

	document.getElementById("gameCanvas").appendChild(renderer.domElement);

	createPlane();
	scene.add(plane);


	/*for (var i = 0; i < bodyLength; ++i) {
		var bodyBlock = newBodyBlock();
		bodyBlock.position.x = startPosition[0] - STEP - i * STEP;
		bodyBlock.position.y = startPosition[1];
		bodyBlock.position.z = startPosition[2];
		scene.add(bodyBlock);

		body.push(bodyBlock);
	}*/

	for (var i = 0; i < bodyLength; ++i) {
    // var bodyBlock = new THREE.Mesh(
  	//   new THREE.CubeGeometry(
  	// 	STEP,
  	// 	STEP,
  	// 	STEP,
  	// 	1,
  	// 	1,
  	// 	1),
  	//   snakeMaterial);
    loader.load(
    // resource URL
    'data/cube_bumpy.obj',
    // called when resource is loaded
    function ( bodyBlock ) {
      bodyBlock.position.x = startPosition[0] - STEP - i * STEP;
      bodyBlock.position.y = startPosition[1];
    	bodyBlock.position.z = startPosition[2];
    	scene.add(bodyBlock);

      body.push(bodyBlock);
    	bodyBlock.receiveShadow = true;
      bodyBlock.castShadow = true;
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

	createHead();
	scene.add(head);

	head.position.x = startPosition[0];
	head.position.y = startPosition[1];
	head.position.z = startPosition[2];

	createDiamond();

	/*placeDiamond();*/
	trickDiamond();

	scene.add(diamond);

/*	pointLight =
		new THREE.PointLight(0xF8D898);

	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	scene.add(pointLight);*/

	sun = new THREE.SpotLight(0xffffff);
	sun.position.set(0, -sunRadius, 0);
	sun.intensity = 3;
	sun.castShadow = true;
	scene.add(sun);

	 lantern = new THREE.SpotLight(0xffffff);
  lantern.position.set(startPosition[0], startPosition[1], startPosition[2] + STEP * 3);
  lantern.intensity = 5;
  lantern.castShadow = true;
  scene.add(lantern);

  // MAGIC SHADOW CREATOR DELUXE EDITION with Lights PackTM DLC
  renderer.shadowMapEnabled = true;

	console.log(scene);
}

function updateLight() {
  sun.position.y = sunRadius * Math.sin(time/10);
  sun.position.z = sunRadius * Math.cos(time/10);

  lantern.position.set(head.position.x, head.position.y, head.position.z + STEP * 3);
}

var fps = 30 * difficulty;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

var time = 0;

function draw()
{
	if (!WIN && !LOSE)
	{
		requestAnimationFrame(draw);

		now = Date.now();
		delta = now - then;

		if (delta > interval) {

			then = now - (delta % interval);
			delta = delta % interval;

			renderer.render(scene, camera);
			headMovement();
			checkDiamond();
			bodyMovement();
			updateCamera();
			updateLight();
			time++;
			checkEndingCondition();
		}

	}
	else if (WIN)
	{
		gameWin();
	}
	else
	{
		gameLose();
	}

}
