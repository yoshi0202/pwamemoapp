class ChangeUnixTime {
  constructor(unixtime) {
    if (unixtime) this.unixtime = new Date(unixtime * 1000);
  }
  getYear() {
    return this.unixtime.getFullYear();
  }
  getMonth() {
    return this.unixtime.getMonth() + 1;
  }
  getDay() {
    return this.unixtime.getDate();
  }
  getHour() {
    return ("0" + this.unixtime.getHours()).slice(-2);
  }
  getMin() {
    return ("0" + this.unixtime.getMinutes()).slice(-2);
  }
  getSec() {
    return ("0" + this.unixtime.getSeconds()).slice(-2);
  }
  getDate() {
    return this.getYear() + "/" + this.getMonth() + "/" + this.getDay();
  }
  getTime() {
    return this.getHour() + ":" + this.getMin() + ":" + this.getSec();
  }
  getFullTimestamp() {
    return this.getDate() + " " + this.getTime();
  }
}

export default {
  methods: {
    changeUnixTime: function(unixtime, format) {
      if (!unixtime || !format) return;
      let date = new ChangeUnixTime(unixtime);
      return date[format]();
    }
  }
};
