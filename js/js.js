function Cassette(song, duration, maxDuration, reversed)
{
	reversed = reversed || false;
	this.reversed = reversed;
	this.song = song;
	this.duration = duration; // Seconds
	this.maxDuration = maxDuration;
	this.position = 0; // Seconds
	this.tapeLength = duration * 15 / 4; // Centimeters
	this.tapeThickness = 0.00026;
	this.reelRadius = 1.4;
	this.cover = true;
	this.reel1 = new Rheel(1, this.duration, this.maxDuration, this.tapeLength, this.tapeThickness, this.reelRadius, this.reversed);
	this.reel2 = new Rheel(2, this.duration, this.maxDuration, this.tapeLength, this.tapeThickness, this.reelRadius, this.reversed);	
	this.position = 0;
	this.playing = false;
	this.lastTime = (new Date()).getTime();
	this.timeInterval = setInterval(function(){}, 100000);
	this.setDuration = function(duration)
	{
		this.duration = duration;
		this.reel1.setDuration(duration); 
		this.reel2.setDuration(duration); 
	}
	this.setMaxDuration = function(maxDuration)
	{
		this.maxDuration = maxDuration;
		this.reel1.setDuration(maxDuration); 
		this.reel2.setDuration(maxDuration); 
	}
	this.play = function()
	{
		this.fastForwardOff();
		this.lastTime = (new Date()).getTime();
		this.playing = true;
		if(this.song.duration > 0)
		{
			this.song.currentTime = this.position;
			this.song.play();
		}
	}
	this.pause = function()
	{
		this.fastForwardOff();
		this.playing = false;
		this.song.pause();
	}
	this.getDeltaTime = function()
	{
		var currentTime = (new Date()).getTime();	
		deltaTime = (currentTime - this.lastTime) / 1000;
		this.lastTime = currentTime;
		return deltaTime;

	}
	this.setPosition = function(position)
	{
		this.position = position;
	}
	this.updatePosition = function(delta)
	{
		this.position += delta;
	}
	this.rewindOn = function()
	{
		clearInterval(that.timeInterval);
		that.timeInterval = setInterval(function(){
			that.updatePosition(-0.5);
			if(that.position <= 0)
			{
				clearInterval(that.timeInterval);
			}
		}, 10);
	}
	this.rewindOff = function()
	{
		clearInterval(this.timeInterval);
	}
	this.fastForwardOn = function()
	{
		clearInterval(that.timeInterval);
		that.timeInterval = setInterval(function(){
			that.updatePosition(0.5);
			if(that.position >= that.duration)
			{
				clearInterval(that.timeInterval);
			}
		}, 10);
	}
	this.fastForwardOff = function()
	{
		clearInterval(this.timeInterval);
	}
	this.openCover = function()
	{
		this.cover = false;
	}
	this.closeCover = function()
	{
		this.cover = true;
	}
	var that = this;
}

function Rheel(label, duration, maxDuration, tapeLength, tapeThickness, reelRadius, reversed)
{
	this.label = label;
	this.duration = duration;
	this.maxDuration = maxDuration;
	this.tapeLength = tapeLength;
	this.tapeThickness = tapeThickness;
	this.reelRadius = reelRadius;
	this.angle = 0;
	this.delta = 0;
	this.angularSpeed = 0;
	this.lastTime = 0;
	this.linearSpeed = 15/4;
	this.reversed = reversed;
	this.setDuration = function(duration)
	{
		this.duration = duration;
	}
	this.setMaxDuration = function(maxDuration)
	{
		this.maxDuration = maxDuration;
	}
	this.drawReel = function(position)
	{
		if(label == 1)
		{
			if(this.reversed)
			{
				this.delta = this.getDelta(this.duration - position);
			}
			else
			{
				this.delta = this.getDelta(position);
			}
			this.radius = reelRadius + this.delta;
		}
		if(label == 2)
		{
			if(this.reversed)
			{
				this.delta = this.getDelta(position);
			}
			else
			{
				this.delta = this.getDelta(this.duration - position);
			}
			this.radius = reelRadius + this.delta;
		}
		var circumference = Math.acos(-1) * 2 * (this.radius);
		
		var deltaTime = position - this.lastTime;
		this.lastTime = position;

		this.angularSpeed = (deltaTime * 50) / circumference;
		
		if(this.reversed)
		{
			this.angle += this.angularSpeed;
		}
		else
		{
			this.angle -= this.angularSpeed;
		}
	}
	this.getDelta = function(position)
	{
		if(position > this.duration)
		{
			position = this.duration;
		}
		var circumference = Math.acos(-1) * 2 * (reelRadius);
		var delta = this.tapeThickness * circumference * position / (this.linearSpeed);
		return delta;
	}
}

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
	// Conversion from centimeter to pixel need a scale
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


