class Rheel {
    constructor(label, duration, maxDuration, tapeLength, tapeThickness, reelRadius, reversed) {
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
        this.linearSpeed = 15 / 4;
        this.reversed = reversed;

        this.setDuration = function (duration) {
            this.duration = duration;
        };
        this.setMaxDuration = function (maxDuration) {
            this.maxDuration = maxDuration;
        };
        this.drawReel = function (position) {
            if (label == 1) {
                if (this.reversed) {
                    this.delta = this.getDelta(this.duration - position);
                }

                else {
                    this.delta = this.getDelta(position);
                }
                this.radius = reelRadius + this.delta;
            }
            if (label == 2) {
                if (this.reversed) {
                    this.delta = this.getDelta(position);
                }

                else {
                    this.delta = this.getDelta(this.duration - position);
                }
                this.radius = reelRadius + this.delta;
            }
            let circumference = Math.acos(-1) * 2 * (this.radius);

            let deltaTime = position - this.lastTime;
            this.lastTime = position;

            this.angularSpeed = (deltaTime * 50) / circumference;

            if (this.reversed) {
                this.angle += this.angularSpeed;
            }

            else {
                this.angle -= this.angularSpeed;
            }
        };
        this.getDelta = function (position) {
            if (position > this.duration) {
                position = this.duration;
            }
            let circumference = Math.acos(-1) * 2 * (reelRadius);
            let delta = this.tapeThickness * circumference * position / (this.linearSpeed);
            return delta;
        };
    }
}
