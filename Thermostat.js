class Thermostat {
  // buttons will be array of 3 onoff inputs corresponding to following functions
  // [-tgt] [+tgt] [off/auto]
  constructor(hvac, tempSensor, buttons, lcd) {
    this.hvac = hvac;
    this.tempSensor = tempSensor;
    this.lcd = lcd;

    this.mode = 1;
    this.accuracy = 0.5;
    this.interval = 60000;

    this.current = tempSensor.readSync();
    this.target = Math.round(this.current);

    this._setupButtons(buttons);
  }

  _setupButtons(buttons) {
    const _this = this;

    function incTarget() {
      this.setTarget(Math.round(this.target) + 1);
    }
    function decTarget() {
      this.setTarget(Math.round(this.target) - 1);
    }
    function toggleMode() {
      this.setMode(!this.mode)
    }

    var callbacks = [decTarget, incTarget, toggleMode].map((a) => {
      return function(err, val) {
        if (err) throw err;
        if (val == 1) a.bind(_this)();
      }
    });
    for (var i = 0; i < callbacks.length; i++)
    {
      buttons[i].watch(callbacks[i]);
    }
  }

  updateLcd() {

    const s1 = 'OBS: ' + Math.round(this.current)
      + ', TGT: ' + Math.round(this.target);
    const s2 = (this.mode ? 'Auto' : 'Off') + ', ' + this.hvac.status;

    if (s1+s2 != this.displayText) {
      this.lcd.clear();
      this.lcd.println(s1, 1);
      this.lcd.println(s2, 2);
    }

    this.displayText = s1+s2;
  }

  updateHvac() {
    if (this.mode == 0) {
      this.hvac.off();
      return;
    }

    var diff = this.target - this.current;
    if (diff > this.accuracy)
      this.hvac.heat();
    else if (diff < -this.accuracy)
      this.hvac.cool();
    else
      this.hvac.off();
  }

  start() {
    this.timeout = setInterval(this.refresh.bind(this), this.interval);
  }
  stop() {
    clearInterval(this.timeout);
  }

  refresh() {
    console.log(this);
    const _this = this;
    process.nextTick(this.updateLcd.bind(this));
    this.tempSensor.read((err, temp) => {
      _this.current = temp;
      _this.updateHvac();
      _this.updateLcd();
    });
  }

  setTarget(tgt) {
    this.target = tgt;
    this.refresh();
  }

  setMode(mode) {
    this.mode = mode+0;
    this.refresh();
  }
}

module.exports = Thermostat;
