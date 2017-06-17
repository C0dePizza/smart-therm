const ds = require('ds18x20');

class TempSensor {
  constructor() {
    this.sId = ds.list()[0];
    this.fahrenheit = true;
  }
  readSync()
  {
    var temp = ds.get(this.sId);
    return this.fahrenheit ? temp*9/5+32 : temp;
  }
  read(cb) {
    ds.get(this.sId, (err, temp) => {
      if (this.fahrenheit)
        temp = 9/5*temp + 32;
      cb(err, temp);
    })
  }
}

module.exports = TempSensor;
