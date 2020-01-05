<template>
  <v-card class="mx-auto" height="300" :elevation="elevation" @mouseover="elevation = 10" @mouseleave="elevation = 0">
    <v-container text-left fluid ma-0 py-3 px-5 fill-height>
      <v-layout column>
        <v-flex md2>
          <v-container fluid fill-height ma-0 pa-0>
            <v-layout align-center>
              <v-flex md10 body-1>{{ data.cardData.title }}</v-flex>
              <v-flex text-center>
                <v-icon small :color="thumbtackColor" @click="changeThumbtackStatus">fas fa-thumbtack</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <v-divider></v-divider>
        <v-flex md8 body-2>{{ data.cardData.contents }}</v-flex>
        <v-divider></v-divider>
        <v-flex md1>
          <v-container fluid fill-height ma-0 pa-0>
            <v-layout align-end text-wrap>
              <v-chip v-for="tag in data.cardData.tags" :key="tag" small class="mt-1">{{ tag }}</v-chip>
            </v-layout>
          </v-container>
        </v-flex>
        <v-flex md1>
          <v-container fluid fill-height ma-0 pa-0>
            <v-layout align-end>
              <v-flex text-right body-2>更新日：{{ changeUnixTimeToDate(data.createdAt) }}</v-flex>
            </v-layout>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
export default {
  Name: "Card",
  data: () => ({
    elevation: "0",
    thumbtackColor: "grey"
  }),
  props: {
    data: Object
  },
  methods: {
    changeThumbtackStatus: function() {
      if (this.thumbtackColor === "orange lighten-2") {
        this.thumbtackColor = "grey";
      } else {
        this.thumbtackColor = "orange lighten-2";
      }
    },
    changeUnixTimeToDate: function(unixtime) {
      var y = new Date(unixtime * 1000);
      var year = y.getFullYear();
      var month = y.getMonth() + 1;
      var day = y.getDate();
      var hour = ("0" + y.getHours()).slice(-2);
      var min = ("0" + y.getMinutes()).slice(-2);
      var sec = ("0" + y.getSeconds()).slice(-2);

      return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
    }
  }
};
</script>

<style></style>
