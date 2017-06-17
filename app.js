const config = require('config');
const Thermostat = require('./Thermostat');
const TempSensor = require('./TempSensor');
const HvacInterface = require('./HvacInterface');
const Gpio = require('onoff').Gpio;
const LCD = require('lcdi2c');

var buttons = config.buttons.map((pin) => {
  return new Gpio(pin, 'in', 'both');
})

var lcd = new LCD(1, 0x27, 16, 2);
var therm = new Thermostat(new HvacInterface(), new TempSensor(), buttons, lcd);
therm.start();
