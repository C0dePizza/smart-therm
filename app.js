const config = require('config');
const Thermostat = require('./Thermostat');
const TempSensor = require('./TempSensor');
const HvacInterface = require('./HvacInterface');
const dataSources = require('./DataSources');
const DataCollector = require('./DataCollector');
const Gpio = require('onoff').Gpio;
const LCD = require('lcdi2c');

const buttons = config.buttons.map((pin) => {
  return new Gpio(pin, 'in', 'both');
})

const lcd = new LCD(1, 0x27, 16, 2);
const therm = new Thermostat(new HvacInterface(), new TempSensor(), buttons, lcd);
therm.start();

const sources = [
  new dataSources.DateTimeSource(),
  new dataSources.WeatherSource(),
  new dataSources.ThermostatSource(therm)
]
const collector = new DataCollector(sources);
collector.start();
