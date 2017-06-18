const request = require('request');

class ThermostatSource {
  constructor(thermostat) {
    this.thermostat = thermostat;
  }
  query() {
    return new Promise((resolve, reject) => {
      resolve({
        targetTemp: this.thermostat.target,
        mode: this.thermostat.mode
      });
    });
  }
  getFields() {
    return ['targetTemp', 'mode'];
  }
}

class DateTimeSource {
  constructor() {}
  query() {
    return new Promise((resolve, reject) => {
      var d = new Date(), m = new Date();
      m.setHours(0,0,0,0);
      resolve({
        time: d - m,
        day: d.getDay()
      });
    });
  }
  getFields() {
    return ['time', 'day'];
  }
}

class WeatherSource {
  // TODO: unhardcode
  constructor(apiKey, location) {
    this.apiKey = '093fbcb663c1369fcc5dbbe4ba57a956';
    this.location = '63124,us';
  }
  query() {

    const url = 'http://api.openweathermap.org/data/2.5/weather?'
      + 'q=' + this.location
      + '&appid=' + this.apiKey;

    function format(d) {
      return {
        temp: d.main.temp,
        humidity: d.main.humidity,
        pressure: d.main.pressure,
        wind: d.wind.speed,
        clouds: d.clouds.all,
        rain: d.rain ? d.rain['3h'] : 0,
        snow: d.snow ? d.snow['3h'] : 0
      }
    }

    return new Promise((resolve, reject) => {
      request(url, (err, res, body) => {
        resolve(format(JSON.parse(body)));
      });
    });
  }
  getFields() {
    return ['temp', 'humidity', 'pressure', 'wind', 'clouds', 'rain', 'snow'];
  }
}

module.exports = {
  ThermostatSource: ThermostatSource,
  DateTimeSource: DateTimeSource,
  WeatherSource: WeatherSource
};
