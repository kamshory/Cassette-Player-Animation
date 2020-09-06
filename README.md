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