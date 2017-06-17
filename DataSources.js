const Forecast = require('forecast');

class ThermostatSource {
  constructor(thermostat) {
    this.thermostat = thermostat;
  }
  query(cb) {
    cb({
      targetTemp: this.thermostat.target;
    });
  }
  getFields() {
    return ['targetTemp'];
  }
}

class DateTimeSource {
  constructor() {}
  query(cb) {
    var d = new Date(), m = new Date();
    m.setHours(0,0,0,0);
    cb({
      time: d - m,
      dotw: d.getDay()
    });
  }
  getFields() {
    return ['time', 'dotw'];
  }
}

class WeatherSource {
  constructor(location) {
    this.forecast = new Forecast({
      service: 'darksky',
      key: 'db73b3e04c0d6aaa902b6f89315cf259',
      units: 'fahrenheit',
      cache: true,      // Cache API requests
      ttl: {            // How long to cache requests. Uses syntax from moment.js: http://momentjs.com/docs/#/durations/creating/
        minutes: 27,
        seconds: 45
      }
    });
  }
  query(cb) {

  }
}
