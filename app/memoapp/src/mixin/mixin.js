export default {
  methods: {
    changeUnixTimeToDate: function(unixtime) {
      var y = new Date(unixtime * 1000);
      var year = y.getFullYear();
      var month = y.getMonth() + 1;
      var day = y.getDate();
      var hour = ("0" + y.getHours()).slice(-2);
      var min = ("0" + y.getMinutes()).slice(-2);
      var sec = ("0" + y.getSeconds()).slice(-2);

      return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
    }
  }
};
