<template>
  <v-card
    class="mx-auto snippy-card card-outter border-bottom-none"
    :ripple="false"
    :retain-focus-on-click="retain"
    @mouseover="elevation = 10"
    @mouseleave="elevation = 0"
    active-class
    @click="show = !show"
  >
    <v-list-item>
      <v-list-item-avatar size="40" color="grey" class="mr-0">
        <img :src="userData[data.userId].imgUrl" alt="avator" />
      </v-list-item-avatar>
      <v-card-title class="subtitle-1 py-0">
        <v-clamp autoresize :max-lines="2">{{ data.snipData.title }}</v-clamp>
      </v-card-title>
    </v-list-item>
    <v-container py-0 text-right>
      <!-- <p class="caption mx-1 my-0">@{{data.userId}}</p> -->
      <!-- <perfect-scrollbar>
        <v-flex style="white-space:nowrap">
          <v-chip
            color="#FFCC80"
            small
            v-for="t in data.snipData.tags"
            :key="t"
            class="mx-3 black--text"
          >{{t}}</v-chip>
        </v-flex>
      </perfect-scrollbar>-->
      <!-- <v-divider></v-divider> -->
    </v-container>
    <!-- <v-card-text class="text--primary py-1 text-left">
      <v-clamp autoresize :max-lines="2">{{ data.snipData.contents }}</v-clamp>
    </v-card-text>-->
    <v-card-actions class="card-actions" style="width:100%">
      <v-layout align-center>
        <v-flex text-left body-2>{{ changeUnixTimeToDate(data.createdAt) }}</v-flex>
        <v-flex text-right>
          <v-btn
            body-2
            small
            text
            color="orange darken-2"
            @click.stop="moveUserPage(data.userId)"
            style="cursor:pointer"
            >@{{ userData[data.userId].displayName }}</v-btn
          >
          <v-btn icon>
            <v-icon size="23" :color="pinColor">mdi-menu-down</v-icon>
          </v-btn>
        </v-flex>
      </v-layout>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-card-text class="text--primary py-1 text-left">
          <v-clamp autoresize :max-lines="3">{{ data.snipData.contents }}</v-clamp>
        </v-card-text>
        <v-container text-right>
          <v-btn small text @click.stop="changePinStatus"><v-icon color="red">mdi-heart-outline</v-icon> </v-btn>
          <v-btn small outlined @click.stop="cardClick" color="orange darken-2" style="cursor:pointer">Read More</v-btn>
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
  created: function() {
    console.log(this.userData);
  },
  data: () => ({
    elevation: "0",
    pinColor: "grey",
    retain: false,
    show: false
  }),
  props: {
    data: Object,
    userData: Object
  },
  methods: {
    changePinStatus: function() {
      this.pinColor = this.pinColor === "orange lighten-2" ? "grey" : "orange lighten-2";
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
  border-bottom: 0 !important;
}
.v-btn {
  text-transform: none !important;
}
</style>
