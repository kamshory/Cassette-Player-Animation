
let weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
let dialLines;
let clockEl;

function initClock()
{
    dialLines = document.getElementsByClassName('diallines');
    clockEl = document.getElementsByClassName('clock')[0];

    for (let i = 1; i < 60; i++) {
        clockEl.innerHTML += "<div class='diallines'></div>";
        dialLines[i].style.transform = "rotate(" + 6 * i + "deg)";
    }
      

    setInterval(function(){
        clock();
    }, 100);
}
function clock() {
  
      var d = new Date(),
      h = d.getHours(),
      m = d.getMinutes(),
      s = d.getSeconds(),
      date = d.getDate(),
      month = d.getMonth() + 1,
      year = d.getFullYear(),
           
      hDeg = h * 30 + m * (360/720),
      mDeg = m * 6 + s * (360/3600),
      sDeg = s * 6;
      
      
  
      var day = weekday[d.getDay()];
  
  if(month < 9) {
    month = "0" + month;
  }

  /*
  hDeg = sDeg * 2;
  mDeg = sDeg * 5;
  sDeg = sDeg * 10;
  */
  
  document.querySelector('.hour-hand').style.transform = "rotate("+hDeg+"deg)";
  document.querySelector('.minute-hand').style.transform = "rotate("+mDeg+"deg)";
  document.querySelector('.second-hand').style.transform = "rotate("+sDeg+"deg)";
  document.querySelector('.date').innerHTML = date+"/"+month+"/"+year;
  document.querySelector('.day').innerHTML = day;
  
}

