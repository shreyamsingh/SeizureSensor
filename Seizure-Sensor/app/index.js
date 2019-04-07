import { Accelerometer } from "accelerometer";
import { BodyPresenceSensor } from "body-presence";
import { display } from "display";
import document from "document";
import { HeartRateSensor } from "heart-rate";
import { OrientationSensor } from "orientation";

const accelLabel = document.getElementById("accel-label");
const accelData = document.getElementById("accel-data");

const bpsLabel = document.getElementById("bps-label");
const bpsData = document.getElementById("bps-data");

const hrmLabel = document.getElementById("hrm-label");
const hrmData = document.getElementById("hrm-data");

import { vibration } from "haptics";

import { geolocation } from "geolocation";
/*let background = document.getElementById("background");
background.fill = "red";*/

const sensors = [];
let count = 0;
if (Accelerometer) {
  const accel = new Accelerometer({ frequency: 30, batch: 120 });
  accel.addEventListener("reading", () => {
    for (let index = 0; index < accel.readings.timestamp.length; index++) {
      console.log(
        `Accelerometer Reading: \
          timestamp=${accel.readings.timestamp[index]}, \
          [${accel.readings.x[index]}, \
          ${accel.readings.y[index]}, \
          ${accel.readings.z[index]}]`
      )
      let currenttime = parseInt(accel.readings.timestamp[index]);
      if (Math.abs(accel.readings.x[index]) > 10 && Math.abs(accel.readings.y[index]) > 10 &&  Math.abs(accel.readings.z[index]) > 10 && (count == 0)) {
        let count = count + 1;
        console.log(count);
        let time1 = parseInt(accel.readings.timestamp[index]);
      }
      if (Math.abs(accel.readings.x[index]) > 10 && Math.abs(accel.readings.y[index]) > 10 && Math.abs(accel.readings.z[index]) > 10 && ((currenttime-time1) < 20)) {
        console.log("Potential seizure! Notifying your emergency contact.");
        accelData.text  = "Potential seizure!"
        vibration.start("ring");
        geolocation.getCurrentPosition(function(position) {
          console.log(position.coords.latitude + "," + position.coords.longitude);
        })

      }
     
    }
    /*accelData.text = JSON.stringify({
      x: accel.x ? accel.x.toFixed(1) : 0,
      y: accel.y ? accel.y.toFixed(1) : 0,
      z: accel.z ? accel.z.toFixed(1) : 0
    });*/
    
  });
  //sensors.push(accel);
  accel.start();
} else {
  accelLabel.style.display = "none";
  accelData.style.display = "none";
}

if (BodyPresenceSensor) {
  const bps = new BodyPresenceSensor();
  bps.addEventListener("reading", () => {
    bpsData.text = JSON.stringify({
      presence: bps.present
    })
  });
  sensors.push(bps);
  bps.start();
} else {bps
  bpsLabel.style.display = "none";
  bpsData.style.display = "none";
}

if (HeartRateSensor) {
  const hrm = new HeartRateSensor({ frequency: 1 });
  hrm.addEventListener("reading", () => {
    hrmData.text = JSON.stringify({
      heartRate: hrm.heartRate ? hrm.heartRate : 0
    });
  });
  sensors.push(hrm);
  hrm.start();
} else {
  hrmLabel.style.display = "none";
  hrmData.style.display = "none";
}


display.addEventListener("change", () => {
  // Automatically stop all sensors when the screen is off to conserve battery
  display.on ? sensors.map(sensor => sensor.start()) : sensors.map(sensor => sensor.stop());
});
