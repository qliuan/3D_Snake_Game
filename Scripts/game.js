//----- GLOBAL VARIABLES -----//
// Scene and objects
var renderer, camera, scene;
var WIDTH = 640,HEIGHT = 360;
var VIEW_ANGLE = 90, ASPECT = WIDTH / HEIGHT, NEAR = 0.1, FAR = 10000;

var STEP = 3;
var head;
var diamond;
var body = [];
var bodyLength = 5;
var startPosition = [0, 0, STEP/2];

var plane;
var	planeQuality = 10;
var planeWidth = 1280;
var planeHeight = 720;
var planeMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0x4BD121
	});

var bodyMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0x1B32C0
	});

var headRadius = STEP/2,
	headSegments = 6,
	headRings = 6;

var headMaterial =
	new THREE.MeshLambertMaterial(
	{
		color: 0xD43001
	});


var diamondRadius = STEP/2,
	diamondSegments = 6,
	diamondRings = 6;

var diamondMaterial =
	new THREE.MeshPhongMaterial(
	{
		color: 0xD43001
	});


// Game variables
var headXSpeed = STEP, headYSpeed = 0;
var score = 0;
var MAX_SCORE = 10;
var WIN = false, LOSE = false;

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

	plane = new THREE.Mesh(
		new THREE.PlaneGeometry(
		planeWidth,
		planeHeight,
		planeQuality,
		planeQuality),
		planeMaterial);
	scene.add(plane);


	for (var i = 0; i < bodyLength; ++i) {
		var bodyBlock = new THREE.Mesh(
			new THREE.CubeGeometry(
			STEP,
			STEP,
			STEP,
			1,
			1,
			1),
			bodyMaterial);
		bodyBlock.position.x = startPosition[0] - STEP - i * STEP;
		bodyBlock.position.y = startPosition[1];
		bodyBlock.position.z = startPosition[2];
		scene.add(bodyBlock);

		body.push(bodyBlock);
	}


	head = new THREE.Mesh(
		new THREE.SphereGeometry(
		headRadius,
		headSegments,
		headRings),
		headMaterial);

	diamond = new THREE.Mesh(
		new THREE.SphereGeometry(
		diamondRadius,
		diamondSegments,
		diamondRings),
		diamondMaterial);

	/*placeDiamond();*/
	trickDiamond();

	scene.add(diamond);

	scene.add(head);

	head.position.x = startPosition[0];
	head.position.y = startPosition[1];
	head.position.z = startPosition[2];

	pointLight =
		new THREE.PointLight(0xF8D898);

	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 2.9;
	pointLight.distance = 10000;
	scene.add(pointLight);

	console.log(scene);
}


var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

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
