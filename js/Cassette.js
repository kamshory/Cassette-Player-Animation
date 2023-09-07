class Cassette {
    constructor(song, duration, maxDuration, sources, reversed) {
        reversed = reversed || false;
        this.index = 0;
        this.reversed = reversed;
        this.song = song;
        this.duration = duration; // Seconds
        this.maxDuration = maxDuration;
        this.sources = sources;
        this.pos = 0; // Seconds
        this.tapeLength = duration * 15 / 4; // Centimeters
        this.tapeThickness = 0.00026;
        this.reelRadius = 1.4;
        this.cover = true;
        this.reel1 = new Rheel(1, this.duration, this.maxDuration, this.tapeLength, this.tapeThickness, this.reelRadius, this.reversed);
        this.reel2 = new Rheel(2, this.duration, this.maxDuration, this.tapeLength, this.tapeThickness, this.reelRadius, this.reversed);
        this.playing = false;
        this.lastTime = (new Date()).getTime();
        this.timeInterval = setInterval(function () { }, 100000);

        this.getSongIndex = function(pos)
        {
            for(let i = 0; i<that.sources.length; i++) // NOSONAR
            {
                if(that.sources[i].start <= pos && that.sources[i].end >= pos)
                {
                    return i;
                }
            }
            return 0;
        }

        this.setDuration = function (duration) {
            this.duration = duration;
            this.reel1.setDuration(duration);
            this.reel2.setDuration(duration);
        };
        this.setMaxDuration = function (maxDuration) {
            this.maxDuration = maxDuration;
            this.reel1.setDuration(maxDuration);
            this.reel2.setDuration(maxDuration);
        };
        this.play = function () {
            this.fastForwardOff();
            this.lastTime = (new Date()).getTime();
            this.playing = true;
            if (this.song.duration > 0) {
                let pos = this.getPosition();
                this.song.currentTime = pos;
                this.song.play();
                this.onPlay(pos);
            }
        };
        this.onPlay = function (pos) {
        };
        this.onPause = function (pos) {
        };
        this.onFoundSong = function(songIndex)
        {

        };
        this.pause = function () {
            this.fastForwardOff();
            this.playing = false;
            this.song.pause();
            let pos = this.getPosition();
            this.onPause(pos);
        };

        this.getDeltaTime = function () {
            let currentTime = (new Date()).getTime();
            let deltaTime = (currentTime - this.lastTime) / 1000;
            this.lastTime = currentTime;
            return deltaTime;

        };
        this.getSongPosition = function () {
            return this.song.currentTime + 0;
        };
        this.setPosition = function (position) {
            this.pos = position;
        };
        this.getPosition = function () {
            return this.pos;
        };
        this.updatePosition = function (delta) {
            this.pos += delta;
        };
        this.rewindOn = function () {
            clearInterval(that.timeInterval);
            that.timeInterval = setInterval(function () {
                that.updatePosition(-0.5);
                that.song.currentTime = that.getPosition();
                if (that.pos <= 0) {
                    clearInterval(that.timeInterval);
                }
            }, 10);
        };
        this.rewindOff = function () {
            clearInterval(this.timeInterval);
        };
        this.fastForwardOn = function () {
            clearInterval(that.timeInterval);
            that.timeInterval = setInterval(function () {
                that.updatePosition(0.5);
                that.song.currentTime = that.getPosition();
                if (that.getPosition() >= that.duration) {
                    clearInterval(that.timeInterval);
                }
            }, 10);
        };
        this.scan = function () {
            clearInterval(that.timeInterval);
            that.timeInterval = setInterval(function () {
                that.updatePosition(0.5);
                let pos = that.getPosition();
                that.song.currentTime = pos;
                let songIndex = that.getSongIndex(pos)
                if (songIndex != that.index) {
                    clearInterval(that.timeInterval);
                    that.onFoundSong(songIndex);
                }
                that.index = songIndex;
            }, 10);
        };
        this.fastForwardOff = function () {
            clearInterval(this.timeInterval);
        };
        this.openCover = function () {
            this.cover = false;
        };
        this.closeCover = function () {
            this.cover = true;
        };
        let that = this;
    }
}

