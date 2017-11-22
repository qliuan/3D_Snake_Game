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
	tail = body[body.length-1];
	tail.position.x = head.position.x;
	tail.position.y = head.position.y;

	tail.geometry.verticesNeedUpdate = true;
}