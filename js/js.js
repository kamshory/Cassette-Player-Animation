
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

function draw()
{
	// Conversion from centimeter to pixel need a scale
	
	let scale = 47;
	
	if(cassette.playing)
	{
		cassette.updatePosition(cassette.getDeltaTime());
	}

	let pos = cassette.getSongPosition();
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
	document.querySelector('.line1').innerText = basename(source.src, '/');
	document.querySelector('.line2').innerText = pos.toFixed(2) + ' / '+cassette.duration.toFixed(2);
	window.requestAnimationFrame(draw);
}

function basename(str, sep) {
    return str.substr(str.lastIndexOf(sep) + 1);
}

function getSong(src, pos)
{
	for(let i = 0; i<src.length; i++)
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
	e.preventDefault();
	e.stopPropagation();
    if (e.key == " " || e.code == "Space" || e.keyCode == 32) {
      document.querySelector(".button-play").click();
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




