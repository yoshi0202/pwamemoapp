<template>
  <v-card
    class="mx-auto snippy-card"
    height="300"
    :elevation="elevation"
    :ripple="false"
    :retain-focus-on-click="retain"
    @mouseover="elevation = 10"
    @mouseleave="elevation = 0"
    @click="cardClick"
    active-class
  >
    <v-container text-left fluid ma-0 pa-0 fill-height>
      <v-layout column>
        <!-- title -->
        <v-flex xs2>
          <v-container py-0>
            <v-layout align-center wrap row>
              <v-flex xs10 body-1>
                <v-container>
                  {{ data.cardData.title }}
                </v-container>
              </v-flex>
              <v-flex xs2 text-center>
                <v-container>
                  <v-icon small :color="thumbtackColor" @click.stop="changeThumbtackStatus">fas fa-thumbtack</v-icon>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <!-- title -->
        <v-container py-0>
          <v-divider></v-divider>
        </v-container>
        <!-- contents -->
        <v-flex xs8 body-2 overflow-y-hidden>
          <v-container v-html="parseMd(data.cardData.contents)"> </v-container>
        </v-flex>
        <!-- contents -->
        <!-- tags -->
        <v-flex xs1 @click.stop="">
          <v-container py-1>
            <v-layout align-center>
              <perfect-scrollbar>
                <v-container ma-0 pa-0 style="max-height:25px;white-space:nowrap;">
                  <v-chip color="#FFCC80" small v-for="t in data.cardData.tags" :key="t" class="mx-1 black--text">{{
                    t
                  }}</v-chip>
                </v-container>
              </perfect-scrollbar>
            </v-layout>
          </v-container>
        </v-flex>
        <!-- tags -->
        <v-container py-0>
          <v-divider></v-divider>
        </v-container>
        <v-flex xs1>
          <v-container py-2>
            <v-layout align-end>
              <v-flex text-center body-2>{{ changeUnixTimeToDate(data.createdAt) }}</v-flex>
            </v-layout>
          </v-container>
        </v-flex>
        <!-- tags -->
      </v-layout>
    </v-container>
  </v-card>
</template>

<script>
import marked from "marked";

export default {
  Name: "Card",
  data: () => ({
    elevation: "0",
    thumbtackColor: "grey",
    retain: false
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

      return year + "/" + month + "/" + day + " " + hour + ":" + min + ":" + sec;
    },
    parseMd: function(sentence) {
      return marked(sentence).replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
      // return marked(sentence, {
      //   breaks: true
      // });
    },
    cardClick: function() {
      this.$router.push(this.data.user + "/card/" + this.data.cardId);
    }
  }
};
</script>

<style>
.snippy-card:focus::before {
  opacity: 0 !important;
}
</style>
