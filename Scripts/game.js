// Global Variables
var renderer, camera, scene;

// set the scene size
var WIDTH = 640,
  HEIGHT = 360;

// set the view
var VIEW_ANGLE = 50,
  ASPECT = WIDTH / HEIGHT,
  NEAR = 0.1,
  FAR = 10000;

function setup()
{
	createScene();

	draw();
}

function createScene()
{
	/*window.alert("createScene");*/

	// create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element (the gameCanvas)
	var c = document.getElementById("gameCanvas");
	c.appendChild(renderer.domElement);

	camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);

	scene = new THREE.Scene();

	// add the camera to the scene
	scene.add(camera);

	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
	camera.position.z = 350;


	// set up the sphere vars
	// lower 'segment' and 'ring' values will increase performance
	var radius = 50,
	segments = 16,
	rings = 16;

	// create the sphere's material
	var sphereMaterial =
	new THREE.MeshLambertMaterial(
	{
	color: 0xD43001
	});

	// Create a ball with sphere geometry
	var ball = new THREE.Mesh(
	    new THREE.SphereGeometry(radius,
	    segments,
	    rings),
	    sphereMaterial);

	// add the sphere to the scene
	scene.add(ball);

	// // create a point light
	pointLight = new THREE.PointLight(0xF8D898);

	// set its position
	pointLight.position.x = -1000;
	pointLight.position.y = 0;
	pointLight.position.z = 1000;
	pointLight.intensity = 5.0;
	pointLight.distance = 10000;

	// add to the scene
	scene.add(pointLight);

}

function draw()
{

	// draw THREE.JS scene
    renderer.render(scene, camera);

	requestAnimationFrame(draw);
}
