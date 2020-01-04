<template>
  <v-card class="mx-auto" height="200" :elevation="elevation" @mouseover="elevation = 10" @mouseleave="elevation = 0">
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          <v-container fluid px-0 pb-5>
            <v-layout>
              <v-flex md10 body-1 text-wrap>
                {{ data.cardData.title }}
              </v-flex>
              <v-flex md2 body-1>
                <v-icon small :color="thumbtackColor" @click="changeThumbtackStatus">fas fa-thumbtack</v-icon>
              </v-flex>
            </v-layout>
          </v-container>
        </v-list-item-title>
        <v-list-item-subtitle>{{ changeUnixTimeToDate(data.createdAt) }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <!-- <v-card-actions>
      <v-btn text>Button</v-btn>
      <v-btn text>Button</v-btn>
    </v-card-actions>-->
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
