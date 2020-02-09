<template>
  <v-container fluid ma-0 pa-0>
    <v-icon
      v-if="userData.userData.url"
      class="pr-5"
      color="purple lighten-2"
      @click="toSns(userData.userData.url)"
    >mdi-home</v-icon>
    <v-icon
      v-if="userData.userData.twitter"
      class="pr-5"
      color="#00acee"
      @click="toSns(userData.userData.twitter)"
    >mdi-twitter</v-icon>
    <v-icon
      v-if="userData.userData.qiita"
      class="pr-5"
      color="#55C500"
      @click="toSns(userData.userData.qiita)"
    >mdi-quora</v-icon>
    <v-icon
      v-if="userData.userData.github"
      class="pr-5"
      color="#171515"
      @click="toSns(userData.userData.qiita)"
    >mdi-github-circle</v-icon>
  </v-container>
</template>

<script>
export default {
  name: "UserPageIcons",
  props: {
    userData: Object
  },
  methods: {
    toSns: function(path) {
      window.open(path, "_blank");
    }
  }
};
</script>

<style>
</style>