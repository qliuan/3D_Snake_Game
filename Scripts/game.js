var renderer, camera, scene;

var planeWidth = 640;
var planeHeight = 360;

var STEP = 3;
var head;
var body = [];
var bodyLength = 5;
var startPosition = [0, 0, STEP/2];
var headXSpeed = STEP, headYSpeed = 0;

function setup()
{
	createScene();

	draw();
}

function createScene()
{
  var WIDTH = 640,
    HEIGHT = 360;

	var VIEW_ANGLE = 90,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

  camera.position.x = startPosition[0] - STEP*3;
  camera.position.y = startPosition[1];
	camera.position.z = startPosition[2] + STEP*5;

	camera.rotation.y = -60 * Math.PI/180;
	camera.rotation.z = -90 * Math.PI/180;

  scene.add(camera);

	renderer.setSize(WIDTH, HEIGHT);

	c.appendChild(renderer.domElement);

	var	planeQuality = 10;

  var snakeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});

  var planeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x4BD121
		});

  var plane = new THREE.Mesh(

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

  	  snakeMaterial);
    bodyBlock.position.x = startPosition[0] - STEP - i * STEP;
    bodyBlock.position.y = startPosition[1];
  	bodyBlock.position.z = startPosition[2];
  	scene.add(bodyBlock);

    body.push(bodyBlock);
    console.log(body);
  	// bodyBlock.receiveShadow = true;
  }

  var radius = STEP/2,
		segments = 6,
		rings = 6;

	var sphereMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0xD43001
		});

	head = new THREE.Mesh(

	  new THREE.SphereGeometry(
		radius,
		segments,
		rings),

	  sphereMaterial);

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

function draw()
{
	renderer.render(scene, camera);
	bodyMovement();
	headMovement();

	requestAnimationFrame(draw);
}
