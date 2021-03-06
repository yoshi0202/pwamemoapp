<template>
  <v-card
    class="ma-0 snippy-card card-outter"
    outlined
    tile
    elevation="0"
    :ripple="false"
    :retain-focus-on-click="retain"
    @mouseover="elevation = 10"
    @mouseleave="elevation = 0"
    active-class
    @click="changeMenuIconStatus"
  >
    <v-snackbar v-model="snackbar" top outlined :timeout="2000" color="purple lighten-2">
      スニペットをコピーしました。
      <v-btn color="white" text @click="snackbar = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-list-item>
      <v-list-item-avatar size="40" color="grey" class="mr-0">
        <v-img :src="userData[data.userId].imgUrl" alt="avatar" />
      </v-list-item-avatar>
      <v-card-title
        class="blue-grey--text text--darken-3 subtitle-1 py-0 font-weight-bold d-flex justify-space-between"
      >
        <v-clamp autoresize :max-lines="2">{{ data.snipData.title }}</v-clamp>
      </v-card-title>
      <v-spacer></v-spacer>
      <v-list-item-icon v-if="show" class="mr-2" @click.stop="snippetCopy(data.snipData.snippets)">
        <v-hover v-slot:default="{ hover }">
          <v-card :elevation="hover ? 5 : 0" tile color="transparent">
            <v-icon color="purple lighten-2">mdi-checkbox-multiple-blank-outline</v-icon>
          </v-card>
        </v-hover>
      </v-list-item-icon>
    </v-list-item>
    <v-container py-1 d-flex justify-start align-center font-weight-thin body-2 blue-grey--text text--darken-3>
      <span v-for="t in data.snipData.tags" :key="t" class="mx-1">
        <img :src="'/img/' + t + '.svg'" alt="tags" width="auto" height="20px" />
      </span>
      <v-spacer></v-spacer>
      <span class="px-4 body-2 subtitle blue-grey--text text--darken-3">
        <v-icon small>mdi-pin</v-icon>
        {{ data.pinCounts }}
      </span>
      <span class="px-2 body-2 subtitle blue-grey--text text--darken-3">
        <v-icon small>mdi-eye</v-icon>
        {{ data.viewCounts }}
      </span>
    </v-container>
    <v-card-actions class="card-actions px-3 pt-0" style="width:100%">
      <v-layout align-center>
        <span class="body-2 subtitle blue-grey--text text--darken-3">{{
          changeUnixTime(data.createdAt, "getFullTimestamp")
        }}</span>
        <v-spacer></v-spacer>
        <v-btn body-2 small text color="purple lighten-2" class="pa-0" @click.stop="moveUserPage(data.userId)"
          ><span class="d-inline-block text-truncate" style="max-width:100px;"
            >@{{ userData[data.userId].displayName }}</span
          ></v-btn
        >
        <v-btn icon class="pa-0">
          <v-icon size="23" color="grey">{{ menuIcon }}</v-icon>
        </v-btn>
      </v-layout>
    </v-card-actions>
    <v-expand-transition>
      <div v-show="show">
        <v-card-text
          v-if="data.snipData.snippets"
          class="text--primary py-1 text-left overflow-y-auto"
          style="max-height:200px; cursor:text"
          @click.stop="snippetCopy(data.snipData.snippets)"
        >
          <pre
            v-highlightjs="data.snipData.snippets"
            style="height:100%"
          ><code :class="data.snipData.tags[0]" style=""></code></pre>
        </v-card-text>
        <v-container py-1>
          <v-layout class="align-center">
            <v-spacer></v-spacer>
            <v-btn outlined @click.stop="cardClick" color="purple lighten-2" class="font-weight-bold mx-3">Show</v-btn>
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
    menuIcon: "mdi-menu-down",
    snackbar: false
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
    },
    cardClick: function() {
      this.$router.push(this.data.userId + "/snip/" + this.data.snipId);
    },
    moveUserPage: function(id) {
      this.$router.push("/user/" + id);
    },
    // snippetCopy: function(v) {
    snippetCopy: function(v) {
      this.$copyText(v);
      this.snackbar = true;
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
  padding-bottom: 40px;
}
.card-actions {
  position: absolute;
  bottom: 0;
}
.card-userid {
  position: absolute;
  bottom: 30px;
}
.snippy-card {
  border-bottom: 0 !important;
}
.v-btn {
  text-transform: none !important;
}
code {
  background-color: #272822 !important;
  width: 100% !important;
  height: 100% !important;
  white-space: pre !important;
  word-wrap: normal !important;
  overflow-wrap: normal !important;
}
</style>
