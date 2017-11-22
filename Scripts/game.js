var renderer, camera, scene;

var planeWidth = 640;
var planeHeight = 360;

var STEP = 10;
var head;
var body = [];
var bodyLength = 5;
var startPosition = [0, 0, STEP/2];
var headXSpeed, headYSpeed;



function setup()
{
	createScene();

	draw();
}

function createScene()
{
	/*window.alert("createScene");*/
  // set the scene size
  var WIDTH = 640,
    HEIGHT = 360;

	// set some camera attributes
	var VIEW_ANGLE = 80,
	  ASPECT = WIDTH / HEIGHT,
	  NEAR = 0.1,
	  FAR = 10000;

	var c = document.getElementById("gameCanvas");

  // create a WebGL renderer, camera
	// and a scene
	renderer = new THREE.WebGLRenderer();
	camera =
	  new THREE.PerspectiveCamera(
		VIEW_ANGLE,
		ASPECT,
		NEAR,
		FAR);

	scene = new THREE.Scene();

	// add the camera to the scene


	// set a default position for the camera
	// not doing this somehow messes up shadow rendering
  camera.position.x = startPosition[0] - STEP;
  camera.position.y = startPosition[1];
	camera.position.z = startPosition[2] + STEP*5;

	camera.rotation.y = 45 * Math.PI/180;
	camera.rotation.z = 90 * Math.PI/180;

  scene.add(camera);

	// start the renderer
	renderer.setSize(WIDTH, HEIGHT);

	// attach the render-supplied DOM element
	c.appendChild(renderer.domElement);

	// set up the playing surface plane

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
		planeWidth,	// 95% of table width, since we want to show where the ball goes out-of-bounds
		planeHeight,
		planeQuality,
		planeQuality),

	  planeMaterial);

	scene.add(plane);

  for (var i = 0; i < bodyLength; ++i) {
    var bodyBlock = new THREE.Mesh(

  	  new THREE.CubeGeometry(
  		STEP,	// this creates the feel of a billiards table, with a lining
  		STEP,
  		STEP,				// an arbitrary depth, the camera can't see much of it anyway
  		1,
  		1,
  		1),

  	  snakeMaterial);
    bodyBlock.position.x = startPosition[0] - i * STEP;
    bodyBlock.position.y = startPosition[1];
  	bodyBlock.position.z = startPosition[2];
  	scene.add(bodyBlock);

    body.push(bodyBlock);
    console.log(body);
  	// bodyBlock.receiveShadow = true;
  }

  pointLight =
    new THREE.PointLight(0xF8D898);

  // set its position
  pointLight.position.x = -1000;
  pointLight.position.y = 0;
  pointLight.position.z = 1000;
  pointLight.intensity = 2.9;
  pointLight.distance = 10000;
  // add to the scene
  scene.add(pointLight);

  console.log(scene);
}

// Handles the Movement of the Snake
function headMovement()
{
	// move left
	if (Key.isDown(Key.A) || Key.isDown(Key.Left))
	{
		var flag = document.getElementById("debug");
		flag.value = "left";

		if (snakeXSpeed != 0)
		{
			if (snakeXSpeed > 0)
			{
				// from +x to +y
				snakeXSpeed = 0;
				snakeYSpeed = STEP;
			}
			else
			{
				// from -x to -y
				snakeXSpeed = 0;
				snakeYSpeed = -STEP;
			}
		}
		else
		{
			if (snakeYSpeed > 0)
			{
				// from +y to -x
				snakeXSpeed = -STEP;
				snakeYSpeed = 0;
			}
			else
			{
				// from -y to +x
				snakeXSpeed = STEP;
				snakeYSpeed = 0;
			}
		}
	}
	// move right
	else if (Key.isDown(Key.D) || Key.isDown(Key.Right))
	{
		// window.alert("Moving Right");
		var flag = document.getElementById("debug");
		flag.value = "right";

		if (snakeXSpeed != 0)
		{
			if (snakeXSpeed > 0)
			{
				// from +x to -y
				snakeXSpeed = 0;
				snakeYSpeed = -STEP;
			}
			else
			{
				// from -x to +y
				snakeXSpeed = 0;
				snakeYSpeed = STEP;
			}
		}
		else
		{
			if (snakeYSpeed > 0)
			{
				// from +y to +x
				snakeXSpeed = STEP;
				snakeYSpeed = 0;
			}
			else
			{
				// from -y to -x
				snakeXSpeed = -STEP;
				snakeYSpeed = 0;
			}
		}
	}
	// move forward
	else
	{
		var flag = document.getElementById("debug");
		flag.value = "forward";
	}

	head.position.x += snakeXSpeed;
	head.position.y += snakeYSpeed;
}

function bodyMovement()
{
	tail = body[body.length-1];
	tail.position.x = head.position.x;
	tail.position.y = head.position.y;
}

function draw()
{
	renderer.render(scene, camera);
	bodyMovement();
	headMovement();

	requestAnimationFrame(draw);
}
