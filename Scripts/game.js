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

	var	planeQuality = 10;
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

  var snakeMaterial =
	  new THREE.MeshLambertMaterial(
		{
		  color: 0x1B32C0
		});
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

function updateCamera() {
  camera.position.x = head.position.x - STEP * 3;
  camera.position.y = head.position.y;
	camera.position.z = head.position.z + STEP * 5;

	camera.rotation.y = -60 * Math.PI/180;
  if (headXSpeed == STEP) {
    camera.rotation.z = -90 * Math.PI/180;
  }
  else if (headXSpeed == (-1) * STEP) {
    camera.rotation.z = 90 * Math.PI/180;
  }
  else if (headYSpeed == STEP) {
    camera.rotation.z = 0;
  }
  else if (headYSpeed == (-1) * STEP) {
    camera.rotation.z = 180 * Math.PI/180;
  }
}

var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

function draw()
{


	requestAnimationFrame(draw);

  now = Date.now();
  delta = now - then;

  if (delta > interval) {
      // update time stuffs

      // Just `then = now` is not enough.
      // Lets say we set fps at 10 which means
      // each frame must take 100ms
      // Now frame executes in 16ms (60fps) so
      // the loop iterates 7 times (16*7 = 112ms) until
      // delta > interval === true
      // Eventually this lowers down the FPS as
      // 112*10 = 1120ms (NOT 1000ms).
      // So we have to get rid of that extra 12ms
      // by subtracting delta (112) % interval (100).
      // Hope that makes sense.

      then = now - (delta % interval);

      renderer.render(scene, camera);
    	bodyMovement();
    	headMovement();
      updateCamera();
  }
}
