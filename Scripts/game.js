var renderer, camera, scene;

var planeWidth = 10000;
var planeHeight = 10000;

var sunRadius = 5000;
var sun, lantern;

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
	  new THREE.MeshPhongMaterial(
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

  plane.receiveShadow = true;
  plane.castShadow = true;

  var loader = new THREE.OBJLoader();



  var snakeMaterial =
	  new THREE.MeshPhongMaterial(
		{
		  color: 0x1B32C0
		});
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

  var radius = STEP/2,
		segments = 6,
		rings = 6;

	var sphereMaterial =
	  new THREE.MeshPhongMaterial(
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

  head.receiveShadow = true;
  head.castShadow = true;

  // pointLight =
  //   new THREE.PointLight(0xF8D898);
  //
  // pointLight.position.x = 0;
  // pointLight.position.y = 0;
  // pointLight.position.z = 1000;
  // pointLight.intensity = 2.9;
  // pointLight.distance = 10000;
  // scene.add(pointLight);

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

var fps = 30;
var now;
var then = Date.now();
var interval = 1000/fps;
var delta;

var time = 0;

function updateLight() {
  sun.position.y = sunRadius * Math.sin(time/10);
  sun.position.z = sunRadius * Math.cos(time/10);

  lantern.position.set(head.position.x, head.position.y, head.position.z + STEP * 3);
}

function draw()
{
	requestAnimationFrame(draw);

	now = Date.now();
	delta = now - then;

	if (delta > interval) {

		then = now - (delta % interval);
		delta = delta % interval;

		renderer.render(scene, camera);
		bodyMovement();
		headMovement();
		updateCamera();
    updateLight();
    time++;
	}
}
