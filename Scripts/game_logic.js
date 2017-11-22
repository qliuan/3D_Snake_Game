// Handles the Movement of the Snake
function headMovement()
{
	// move left
	if (Key.isDown(Key.A) || Key.isDown(Key.Left))
	{
		var flag = document.getElementById("debug");
		flag.value = "left";

		if (headXSpeed != 0)
		{
			if (headXSpeed > 0)
			{
				// from +x to +y
				headXSpeed = 0;
				headYSpeed = STEP;
			}
			else
			{
				// from -x to -y
				headXSpeed = 0;
				headYSpeed = -STEP;
			}
		}
		else
		{
			if (headYSpeed > 0)
			{
				// from +y to -x
				headXSpeed = -STEP;
				headYSpeed = 0;
			}
			else
			{
				// from -y to +x
				headXSpeed = STEP;
				headYSpeed = 0;
			}
		}
	}
	// move right
	else if (Key.isDown(Key.D) || Key.isDown(Key.Right))
	{
		// window.alert("Moving Right");
		var flag = document.getElementById("debug");
		flag.value = "right";

		if (headXSpeed != 0)
		{
			if (headXSpeed > 0)
			{
				// from +x to -y
				headXSpeed = 0;
				headYSpeed = -STEP;
			}
			else
			{
				// from -x to +y
				headXSpeed = 0;
				headYSpeed = STEP;
			}
		}
		else
		{
			if (headYSpeed > 0)
			{
				// from +y to +x
				headXSpeed = STEP;
				headYSpeed = 0;
			}
			else
			{
				// from -y to -x
				headXSpeed = -STEP;
				headYSpeed = 0;
			}
		}
	}
	// move forward
	else
	{
		var flag = document.getElementById("debug");
		flag.value = "forward";
	}

	head.position.x += headXSpeed;
	head.position.y += headYSpeed;

	head.geometry.verticesNeedUpdate = true;
}

function bodyMovement()
{
	tail = body.pop();
	tail.position.x = head.position.x;
	tail.position.y = head.position.y;

	body.unshift(tail);
	tail.geometry.verticesNeedUpdate = true;
}

function updateCamera() {
	if (headXSpeed == STEP) {
		camera.position.x = head.position.x - STEP * 3;
		camera.position.y = head.position.y;
		camera.rotation.x = 0;
		camera.rotation.y = -60 * Math.PI/180;
		camera.rotation.z = -90 * Math.PI/180;
	}
	else if (headXSpeed == (-1) * STEP) {
		camera.position.x = head.position.x + STEP * 3;
		camera.position.y = head.position.y;
		camera.rotation.x = 0;
		camera.rotation.y = 60 * Math.PI/180;
		camera.rotation.z = 90 * Math.PI/180;
	}
	else if (headYSpeed == STEP) {
		camera.position.x = head.position.x;
		camera.position.y = head.position.y - STEP * 3;
		camera.rotation.x = 60 * Math.PI/180;
		camera.rotation.y = 0;
		camera.rotation.z = 0;
	}
	else if (headYSpeed == (-1) * STEP) {
		camera.position.x = head.position.x;
		camera.position.y = head.position.y + STEP * 3;
		camera.rotation.x = -60 * Math.PI/180;
		camera.rotation.y = 0;
		camera.rotation.z = 180 * Math.PI/180;
	}
}