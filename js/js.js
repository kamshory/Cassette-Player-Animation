
function imageRotate(image, angle)
{
	let degrees = 180 * angle / Math.acos(-1);
	let canv = document.createElement('canvas');
	canv.width = image.width;
	canv.height = image.height;
	let ctx = canv.getContext('2d');
	ctx.clearRect(0,0,canv.width,canv.height);
	ctx.save();
	ctx.translate(canv.width/2,canv.height/2);
	ctx.rotate(degrees*Math.PI/180);
	ctx.drawImage(image,-image.width/2,-image.width/2);
	ctx.restore();
		
	return canv;
}

let lastPlayTime = (new Date()).getTime();

function draw()
{
	// Conversion from centimeter to pixel need a scale
	
	let scale = 47;
	
	if(cassette.playing)
	{
		cassette.updatePosition(cassette.getDeltaTime());
	}

	let pos = cassette.getPosition();
	cassette.reel1.drawReel(pos);
	cassette.reel2.drawReel(pos);

	let canvas = document.querySelector('#canvas');
	let ctx = canvas.getContext('2d');
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.drawImage(img2, 0, 0);
	
	let point1 = {x:412, y:170};
	let point2 = {x:172, y:170};
	let point3 = {x:552, y:300};
	let point4 = {x:34, y:300};

	let reelRadius = 62; // In pixel
	
	
	ctx.beginPath();
	ctx.arc(point1.x, point1.y, cassette.reel1.radius * scale, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#110404';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#110404';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(point2.x, point2.y, cassette.reel2.radius * scale, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#110404';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#110404';
	ctx.stroke();
	
	ctx.globalCompositeOperation = "destination-out";

	ctx.beginPath();
	ctx.arc(point1.x, point1.y, reelRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#FFFFFF';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#FFFFFF';
	ctx.stroke();
	
	ctx.beginPath();
	ctx.arc(point2.x, point2.y, reelRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = '#FFFFFF';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#FFFFFF';
	ctx.stroke();
	
	ctx.globalCompositeOperation = "source-over";	

	ctx.drawImage(imageRotate(img1, cassette.reel1.angle), point1.x - reelRadius, point1.y - reelRadius);
	ctx.drawImage(imageRotate(img1, cassette.reel2.angle), point2.x - reelRadius, point2.y - reelRadius);	
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#ff0000";
	
	let point5 = getPont(1, point1, point3, cassette.reel1.radius * scale);
	let point6 = getPont(2, point2, point4, cassette.reel2.radius * scale);

	ctx.lineWidth = 1;
	ctx.strokeStyle = "#484040";

	ctx.beginPath();
	ctx.moveTo(point4.x, point4.y);
	ctx.lineTo(point6.x, point6.y);
	ctx.stroke();
	
	ctx.lineWidth = 1;
	ctx.strokeStyle = "#484040";

	ctx.beginPath();
	ctx.moveTo(point3.x, point3.y);
	ctx.lineTo(point5.x, point5.y);
	ctx.stroke();
	
	if(cassette.cover)
	{
		ctx.drawImage(img3, 0, 0);
	}
	
	if(cassette.position >= maxDuration)
	{
		cassette.position = maxDuration;
	}
	let source = getSong(sources, pos);
	if(typeof source != 'undefined' && typeof source.src != 'undefined')
	{
		document.querySelector('.line1').innerText = basename(source.src, '/');
	}
	document.querySelector('.line2').innerText = pos.toFixed(2) + ' / '+cassette.duration.toFixed(2);
	renderFrame();
	window.requestAnimationFrame(draw);
}

function basename(str, sep) {
    return str.substr(str.lastIndexOf(sep) + 1);
}

function getSong(src, pos)
{
	for(let i = 0; i<src.length; i++) // NOSONAR
	{
		if(src[i].start <= pos && src[i].end >= pos)
		{
			return src[i];
		}
	}
	return '';
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
	let distance = getDistance(point1, point2);
	let side = getSide(distance, radius);
	
	let gradient = contraGradient(point1, point2);
	let angle = Math.atan(gradient);
	
	let angle2 = Math.asin(side/distance);
	let point = {};
	if(label == 1)
	{
		let angle3 = angle + angle2 - (Math.PI/2);
		
		let x = Math.cos(angle3) * radius;
		let y = Math.sin(angle3) * radius;
		point = {x: point1.x + x, y:point1.y - y};
	}
	if(label == 2)
	{
		let angle3 = (Math.PI/2) + angle - angle2;
		
		let x = Math.cos(angle3) * radius;
		let y = Math.sin(angle3) * radius;
		point = {x: point1.x - x, y:point1.y + y};
	}
	return point;
}



window.onload = function()
{

	document.querySelector('.button-play').addEventListener('click', function(e){
		let obj = document.querySelector('.button-play');
		let status = obj.getAttribute('data-status');
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
		let obj = document.querySelector('.button-rewind');
		let status = obj.getAttribute('data-status');
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
		let obj = document.querySelector('.button-fast-forward');
		let status = obj.getAttribute('data-status');
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
		let obj = document.querySelector('.button-pause');
		let status = obj.getAttribute('data-status');
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
		let obj = document.querySelector('.button-stop');
		let status = obj.getAttribute('data-status');
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
		let obj = document.querySelector('.button-open');
		let status = obj.getAttribute('data-status');
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

	document.addEventListener("keydown", function (e) {
		if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
		document.querySelector(".button-play").click();
		e.preventDefault();
		e.stopPropagation();
		} else if (e.code == "ArrowLeft" || e.keyCode == 37) {
		document.querySelector(".button-rewind").click();
		} else if (e.code == "ArrowRight" || e.keyCode == 39) {
		document.querySelector(".button-fast-forward").click();
		}
	});

	let blobs = [];
	let finish = 0;
	for(let i in sources)
	{
		const myRequest = new Request(sources[i].src);
		fetch(myRequest)
		.then((response) => response.blob())
		.then((myBlob) => {
			const blobUrl = URL.createObjectURL(myBlob);
			const songx = new Audio(blobUrl);
			songx.onloadedmetadata = function() {
				const idx = parseInt(i);
				songs[idx] = songx;
				blobs[idx] = myBlob;
				sources[idx].duration = songs[idx].duration;
				sources[idx].index = idx;
				finish++;
				if(finish == sources.length)
				{
					processBlobs(blobs);
				}
			};
		});
	}
}

let songAll;

function Counter()
{
	this.currentTime = 0;
	this.lastPlayTime = 0;
	this.lastPlayPosition = 0;
	this.started = false;
	this.paused = false;
	this.lastPosition = 0;

	this.start = function(position)
	{
		this.lastPlayPosition = position;
		this.lastPlayTime = (new Date()).getTime();
		this.started = true;
		this.paused = false;
	}

	this.pause = function(pos)
	{
		this.paused = true;
	}

	this.getPosition = function()
	{
		if(!this.started)
		{
			return 0;
		}
		if(this.paused)
		{
			return this.lastPosition;
		}
		let time = (new Date()).getTime() - this.lastPlayTime;
		let pos = (time/1000) + this.lastPlayPosition;
		if(pos < 0)
		{
			pos = 0;
		}
		this.lastPosition = pos;
		return pos;
	}
	
}

let context = new AudioContext();
let src = null;
let analyser = null;
let canvasAnalyzer = null;
let ctxAnalyzer = null;
let dataArray = null;
let bufferLength = 4096;
let barWidth = 10;
let barHeight = 20;

function connectToAnalizer(audio, canvas)
{
	canvasAnalyzer = canvas;
	src = context.createMediaElementSource(audio);
	analyser = context.createAnalyser();
	
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	ctxAnalyzer = canvas.getContext("2d");
	
	src.connect(analyser);
	analyser.connect(context.destination);
	
	analyser.fftSize = 256;
	
	bufferLength = analyser.frequencyBinCount;
	console.log(bufferLength);
	
	dataArray = new Uint8Array(bufferLength);
	 	
	barWidth = (canvasAnalyzer.width / bufferLength) * 2.5;
	
}



function renderFrame() {
  let x = 0;

  analyser.getByteFrequencyData(dataArray);

  ctxAnalyzer.fillStyle = "#121116";
  ctxAnalyzer.fillRect(0, 0, canvasAnalyzer.width, canvasAnalyzer.height);

  for (let i = 0; i < bufferLength; i++) {
	let barHeight = dataArray[i];
	
	let r = barHeight + (25 * (i/bufferLength));
	let g = 250 * (i/bufferLength);
	let b = 50;

	ctxAnalyzer.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	ctxAnalyzer.fillRect(x, canvasAnalyzer.height - barHeight, barWidth, barHeight);

	x += barWidth + 1;
  }
}


function processBlobs(blobs)
{
	let offset = 0;
	for(let i in sources)
	{
		sources[i].offset = offset;
		sources[i].start = offset;
		sources[i].end = offset + sources[i].duration;
		offset += sources[i].duration;
	}
	let blob = new Blob(blobs);
	let blobUrl = URL.createObjectURL(blob);
	songAll = new Audio(blobUrl);
	let duration = 0;
	let maxDuration = 0;
	songAll.onloadedmetadata = function() {
		duration = songAll.duration;
		maxDuration = songAll.duration;
		cassette = new Cassette(songAll, duration, maxDuration, sources, false);
		cassette.onPlay = function(pos)
		{
			document.querySelector('.layer1').classList.add('on');
			document.querySelector('.layer1').classList.remove('off');
		}
		cassette.onPause = function(pos)
		{
			document.querySelector('.layer1').classList.add('off');
			document.querySelector('.layer1').classList.remove('on');
		}
		connectToAnalizer(songAll, document.querySelector('#canvasanalyzer'));
		draw();	
	};
}

let songs = [];
let sources = [
	{src:'songs/Lagu 0010.mp3'},
	{src:'songs/Lagu 0011.mp3'},
	{src:'songs/Lagu 0012.mp3'},
	{src:'songs/Lagu 0015.mp3'},
	{src:'songs/Lagu 0016.mp3'},
	{src:'songs/Lagu 0017.mp3'},
	{src:'songs/Lagu 0018.mp3'},
	{src:'songs/Lagu 0019.mp3'}
];


let duration = 0;
let maxDuration = 0;

let img1 = new Image();
img1.src = 'css/img/cs_wheel.png';

let img2 = new Image();
img2.src = 'css/img/cs_back.png';

let img3 = new Image();
img3.src = 'css/img/cs_front.png';

let song;
let cassette;




