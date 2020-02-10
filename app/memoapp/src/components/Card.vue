<template>
  <v-card
    class="mx-auto snippy-card card-outter border-bottom-none"
    :ripple="false"
    :retain-focus-on-click="retain"
    @mouseover="elevation = 10"
    @mouseleave="elevation = 0"
    active-class
    @click="changeMenuIconStatus"
  >
    <v-list-item>
      <v-list-item-avatar size="40" color="grey" class="mr-0">
        <img :src="userData[data.userId].imgUrl" alt="avator" />
      </v-list-item-avatar>
      <v-card-title class="subtitle-1 py-0 font-weight-bold">
        <v-clamp autoresize :max-lines="2">{{ data.snipData.title }}</v-clamp>
      </v-card-title>
    </v-list-item>
    <v-container py-0 text-right> </v-container>
    <v-card-actions class="card-actions px-3" style="width:100%">
      <v-layout align-center>
        <span class="body-2 font-weight-thin">{{ changeUnixTimeToDate(data.createdAt) }}</span>
        <v-spacer></v-spacer>
        <v-btn
          body-2
          small
          text
          color="purple lighten-2"
          class="pa-0"
          @click.stop="moveUserPage(data.userId)"
          style="cursor:pointer"
          >@{{ userData[data.userId].displayName }}</v-btn
        >
        <v-btn icon class="pa-0">
          <v-icon size="23" color="grey">{{ menuIcon }}</v-icon>
        </v-btn>
      </v-layout>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-card-text class="text--primary py-1 text-left">
          <v-clamp autoresize :max-lines="3">{{ data.snipData.contents }}</v-clamp>
        </v-card-text>
        <v-container py-1>
          <v-layout class="align-center">
            <span class="body-2">
              <v-icon small color="black">mdi-pin</v-icon>
              {{ data.pinCounts }}
            </span>
            <span class="body-2 ml-10">
              <v-icon small color="black">mdi-eye</v-icon>
              {{ data.viewCounts }}
            </span>
            <v-spacer></v-spacer>
            <v-btn small outlined @click.stop="cardClick" color="purple lighten-2" style="cursor:pointer"
              >Read More</v-btn
            >
          </v-layout>
        </v-container>
      </div>
    </v-expand-transition>
  </v-card>
</template>

<script>
import marked from "marked";
import VClamp from "vue-clamp";
import Mixin from "../mixin/mixin";

export default {
  Name: "Card",
  created: function() {},
  data: () => ({
    elevation: "0",
    pinColor: "grey",
    retain: false,
    show: false,
    menuIcon: "mdi-menu-down"
  }),
  props: {
    data: Object,
    userData: Object
  },
  methods: {
    changeMenuIconStatus: function() {
      this.menuIcon = this.menuIcon === "mdi-menu-down" ? "mdi-menu-up" : "mdi-menu-down";
      this.show = !this.show;
    },
    parseMd: function(sentence) {
      return marked(sentence).replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "");
      // return marked(sentence, {
      // breaks: true
      // });
    },
    cardClick: function() {
      this.$router.push(this.data.userId + "/snip/" + this.data.snipId);
    },
    moveUserPage: function(id) {
      this.$router.push("/user/" + id);
    }
  },
  components: {
    VClamp
  },
  mixins: [Mixin]
};
</script>

<style scope>
.snippy-card:focus::before {
  opacity: 0 !important;
}
.card-outter {
  position: relative;
  padding-bottom: 50px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}
.card-userid {
  position: absolute;
  bottom: 30px;
}
.border-bottom-none {
  border: 0 !important;
}
.v-btn {
  text-transform: none !important;
}
</style>
