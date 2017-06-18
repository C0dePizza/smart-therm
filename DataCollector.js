// this will harvest data from various sources and export it to a csv or something
// constructor will take an array of DataSource objects
const fse = require('fs-extra');

class DataCollector {
  constructor(sources) {
    this.sources = sources;
    this.dataFile = './data/data.json';
  }

  // collects data from all sources
  collect() {
    const promises = this.sources.map((src) => {
      return src.query();
    });

    return Promise.all(promises)
    .then((values) => {

      const dp = Object.assign.apply(this, values);
      dp.timestamp = new Date().getTime();

      return fse.readJson(this.dataFile)
      .then((obj) => {
        obj.push(dp)
        return fse.writeJson(this.dataFile, obj);
      })
      .catch((obj) => {
        return fse.writeJson(this.dataFile, [dp]);
      });
    });
  }
}

module.exports = DataCollector;
