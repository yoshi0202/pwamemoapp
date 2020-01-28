<template>
  <v-card
    class="mx-auto snippy-card"
    height="300px"
    :elevation="elevation"
    :ripple="false"
    :retain-focus-on-click="retain"
    @mouseover="elevation = 10"
    @mouseleave="elevation = 0"
    @click="cardClick"
    active-class
  >
    <v-container text-left fluid ma-0 pa-0 fill-height>
      <v-container style="height:20%" class="d-flex align-center">
        <v-row class="pa-3">
          <v-col cols="10" class="pa-0">
            <v-container fluid pa-0 fill-height>
              <v-clamp autoresize :max-lines="2">{{ data.cardData.title }}</v-clamp>
            </v-container>
          </v-col>
          <v-col cols="1">
            <v-container>
              <v-icon small :color="thumbtackColor" @click.stop="changeThumbtackStatus">fas fa-thumbtack</v-icon>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
      <v-container py-0>
        <v-divider></v-divider>
      </v-container>
      <v-container style="height:60%" body-2 fluid>
        <v-clamp autoresize :max-lines="8"> {{ data.cardData.contents }} </v-clamp>
      </v-container>
      <v-container style="height:10%" pa-0 ma-0 class="d-flex align-center" @click.stop="">
        <perfect-scrollbar>
          <v-flex style="white-space:nowrap">
            <v-chip color="#FFCC80" small v-for="t in data.cardData.tags" :key="t" class="mx-3 black--text">{{
              t
            }}</v-chip>
          </v-flex>
        </perfect-scrollbar>
      </v-container>
      <v-container py-0>
        <v-divider></v-divider>
      </v-container>
      <v-container class="d-flex align-center font-weight-thin text-center" style="height:10%" pa-0 ma-0 body-2>
        <v-container text-center>
          {{ changeUnixTimeToDate(data.createdAt) }}
        </v-container>
      </v-container>
    </v-container>
  </v-card>
</template>

<script>
import marked from "marked";
import VClamp from "vue-clamp";
import Mixin from "../mixin/mixin";

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
      this.thumbtackColor = this.thumbtackColor === "orange lighten-2" ? "grey" : "orange lighten-2";
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
  },
  components: {
    VClamp
  },
  mixins: [Mixin]
};
</script>

<style>
.snippy-card:focus::before {
  opacity: 0 !important;
}
</style>
