const Gpio = require('onoff').Gpio;
const pins = require('config').hvacPins;

class HvacInterface {
  constructor() {
    this.outs = pins.map((p) => {
      var g = new Gpio(p, 'out');
      g.writeSync(1);
      return g;
    });
    this.status = 'idle';
  }
  writeOuts(vals) {
    for (var i = 0; i < this.outs.length; i++) {
      this.outs[i].writeSync(vals[i]);
    }
  }
  heat() {
    this.status = 'heating';
    this.writeOuts([0,1,1]);
  }
  cool() {
    this.status = 'cooling';
    this.writeOuts([1,0,0]);
  }
  off() {
    this.status = 'idle';
    this.writeOuts([1,1,1]);
  }
}

module.exports = HvacInterface;
