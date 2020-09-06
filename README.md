# Cassette-Player-Animation

Cassette player animation is a web-based animation using canvas. This animation is suitable for use in song player applications.

- File Type : all audio type supported by the browser
- Maximum Duration : 90 minutes
- Function : play, rewind, fast forward, pause, stop, open cassette cover

# Usage

```javascript
var cassette = new Cassette(song, duration, maxDuration, false);
```

- song : audio object
- duration : song duration (in second)
- maxDuration : maximum duration of the cassette (in second), maximum 2700
- reverse : true for reversed direction

# Example

```javascript
function imageRotate(image, angle)
{
	var degrees = 180 * angle / Math.acos(-1);
	var canv = document.createElement('canvas');
	canv.width = image.width;
	canv.height = image.height;
	var ctx = canv.getContext('2d');
	ctx.clearRect(0,0,canv.width,canv.height);
	ctx.save();
	ctx.translate(canv.width/2,canv.height/2);
	ctx.rotate(degrees*Math.PI/180);
	ctx.drawImage(image,-image.width/2,-image.width/2);
	ctx.restore();
		
	return canv;
}

function draw()
{
	var scale = 47;
	
	if(cassette.playing)
	{
		cassette.updatePosition(cassette.getDeltaTime());
	}
	cassette.reel1.drawReel(cassette.position);
	cassette.reel2.drawReel(cassette.position);

	var canvas = document.querySelector('#canvas');
	var context = canvas.getContext('2d');
	
	context.clearRect(0, 0, canvas.width, canvas.height);

	context.drawImage(img2, 0, 0);
	
	var point1 = {x:412, y:170};
	var point2 = {x:172, y:170};
	var point3 = {x:552, y:300};
	var point4 = {x:34, y:300};

	var reelRadius = 62; // In pixel
	
	
	context.beginPath();
	context.arc(point1.x, point1.y, cassette.reel1.radius * scale, 0, 2 * Math.PI, false);
	context.fillStyle = '#110404';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#110404';
	context.stroke();
	
	context.beginPath();
	context.arc(point2.x, point2.y, cassette.reel2.radius * scale, 0, 2 * Math.PI, false);
	context.fillStyle = '#110404';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#110404';
	context.stroke();
	
	context.globalCompositeOperation = "destination-out";

	context.beginPath();
	context.arc(point1.x, point1.y, reelRadius, 0, 2 * Math.PI, false);
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#FFFFFF';
	context.stroke();
	
	context.beginPath();
	context.arc(point2.x, point2.y, reelRadius, 0, 2 * Math.PI, false);
	context.fillStyle = '#FFFFFF';
	context.fill();
	context.lineWidth = 1;
	context.strokeStyle = '#FFFFFF';
	context.stroke();
	
	context.globalCompositeOperation = "source-over";
	

	context.drawImage(imageRotate(img1, cassette.reel1.angle), point1.x - reelRadius, point1.y - reelRadius);
	context.drawImage(imageRotate(img1, cassette.reel2.angle), point2.x - reelRadius, point2.y - reelRadius);
	
	
	context.lineWidth = 1;
	context.strokeStyle = "#ff0000";
	
	var point5 = getPont(1, point1, point3, cassette.reel1.radius * scale);
	var point6 = getPont(2, point2, point4, cassette.reel2.radius * scale);

	context.lineWidth = 1;
	context.strokeStyle = "#484040";

	context.beginPath();
	context.moveTo(point4.x, point4.y);
	context.lineTo(point6.x, point6.y);
	context.stroke();
	
	context.lineWidth = 1;
	context.strokeStyle = "#484040";

	context.beginPath();
	context.moveTo(point3.x, point3.y);
	context.lineTo(point5.x, point5.y);
	context.stroke();
	
	if(cassette.cover)
	{
		context.drawImage(img3, 0, 0);
	}
	
	if(cassette.position >= maxDuration)
	{
		cassette.position = maxDuration;
	}
	window.requestAnimationFrame(draw);
}

function getDistance(point1, point2)
{
	return Math.sqrt(
		((point1.x - point2.x) * (point1.x - point2.x))
		+
		((point1.y - point2.y) * (point1.y - point2.y))		
		);
}
function getSide(distance1, distance2)
{
	return Math.sqrt(
		((distance1) * (distance1))
		-
		((distance2) * (distance2))		
		);
}
function contraGradient(point1, point2)
{
	return (point1.y - point2.y) / (point1.x - point2.x);
}
function getPont(label, point1, point2, radius)
{
	var distance = getDistance(point1, point2);
	var side = getSide(distance, radius);
	
	var gradient = contraGradient(point1, point2);
	var angle = Math.atan(gradient);
	
	var angle2 = Math.asin(side/distance);
	
	if(label == 1)
	{
		var angle3 = angle + angle2 - (Math.PI/2);
		
		var x = Math.cos(angle3) * radius;
		var y = Math.sin(angle3) * radius;
		var point = {x: point1.x + x, y:point1.y - y};
	}
	if(label == 2)
	{
		var angle3 = (Math.PI/2) + angle - angle2;
		
		var x = Math.cos(angle3) * radius;
		var y = Math.sin(angle3) * radius;
		var point = {x: point1.x - x, y:point1.y + y};
	}
	return point;
}



window.onload = function()
{

	document.querySelector('.button-play').addEventListener('click', function(e){
		var obj = document.querySelector('.button-play');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.pause();
		}
		else
		{
			status = 'on';
			document.querySelector('.button-rewind').setAttribute('data-status', 'off');
			document.querySelector('.button-fast-forward').setAttribute('data-status', 'off');
			document.querySelector('.button-pause').setAttribute('data-status', 'off');
			document.querySelector('.button-stop').setAttribute('data-status', 'off');
			cassette.play();
		}
		obj.setAttribute('data-status', status);
	});
	document.querySelector('.button-rewind').addEventListener('click', function(e){
		var obj = document.querySelector('.button-rewind');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.fastForwardOff();
			cassette.rewindOff();
		}
		else
		{
			status = 'on';
			document.querySelector('.button-play').setAttribute('data-status', 'off');
			document.querySelector('.button-fast-forward').setAttribute('data-status', 'off');
			document.querySelector('.button-pause').setAttribute('data-status', 'off');
			document.querySelector('.button-stop').setAttribute('data-status', 'off');
			cassette.pause();
			if(cassette.reversed)
			{
				cassette.fastForwardOn();
			}
			else
			{
				cassette.rewindOn();
			}
		}
		obj.setAttribute('data-status', status);
	});

	document.querySelector('.button-fast-forward').addEventListener('click', function(e){
		var obj = document.querySelector('.button-fast-forward');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.fastForwardOff();
			cassette.rewindOff();
		}
		else
		{
			status = 'on';
			document.querySelector('.button-play').setAttribute('data-status', 'off');
			document.querySelector('.button-rewind').setAttribute('data-status', 'off');
			document.querySelector('.button-pause').setAttribute('data-status', 'off');
			document.querySelector('.button-stop').setAttribute('data-status', 'off');
			cassette.pause();
			if(cassette.reversed)
			{
				cassette.rewindOn();
			}
			else
			{
				cassette.fastForwardOn();
			}
		}
		obj.setAttribute('data-status', status);
	});

	document.querySelector('.button-pause').addEventListener('click', function(e){
		var obj = document.querySelector('.button-pause');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.rewindOff();
			cassette.fastForwardOff();
		}
		else
		{
			status = 'on';
			document.querySelector('.button-play').setAttribute('data-status', 'off');
			document.querySelector('.button-rewind').setAttribute('data-status', 'off');
			document.querySelector('.button-fast-forward').setAttribute('data-status', 'off');
			document.querySelector('.button-stop').setAttribute('data-status', 'off');
			cassette.pause();
			cassette.rewindOff();
			cassette.fastForwardOff();
		}
		obj.setAttribute('data-status', status);
	});
	document.querySelector('.button-stop').addEventListener('click', function(e){
		var obj = document.querySelector('.button-stop');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.rewindOff();
			cassette.fastForwardOff();
		}
		else
		{
			status = 'on';
			document.querySelector('.button-play').setAttribute('data-status', 'off');
			document.querySelector('.button-rewind').setAttribute('data-status', 'off');
			document.querySelector('.button-fast-forward').setAttribute('data-status', 'off');
			document.querySelector('.button-stop').setAttribute('data-status', 'off');
			cassette.pause();
			cassette.rewindOff();
			cassette.fastForwardOff();
		}
		obj.setAttribute('data-status', status);
	});
	document.querySelector('.button-open').addEventListener('click', function(e){
		var obj = document.querySelector('.button-open');
		var status = obj.getAttribute('data-status');
		if(status == 'on')
		{
			status = 'off';
			cassette.closeCover();
		}
		else
		{
			status = 'on';
			cassette.openCover();
		}
		obj.setAttribute('data-status', status);
	});

	draw();
}
var duration = 0;
var maxDuration = 0;

var img1 = new Image();
img1.src = 'css/img/cs_wheel.png';

var img2 = new Image();
img2.src = 'css/img/cs_back.png';

var img3 = new Image();
img3.src = 'css/img/cs_front.png';
var song = new Audio();
song.src = 'songs/BlueDucks_FourFlossFiveSix.mp3';
song.onloadedmetadata = function() {
	setTimeout(
	function(){
	duration = song.duration;
	maxDuration = song.duration;
	cassette.setDuration(song.duration);
	cassette.setMaxDuration(song.duration);
	}, 100);
};
var cassette = new Cassette(song, duration, maxDuration, false);

```