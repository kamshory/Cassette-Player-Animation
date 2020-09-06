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