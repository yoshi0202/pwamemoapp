<template>
  <v-container>{{ cardData }}</v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPage",
  created: async function() {
    const apiUrl = this.$store.getters.getApiUrl;
    const userInfo = this.$store.getters.getLogin;
    this.cardData = await axios.get(apiUrl + userInfo.id + "/cards");
  },
  data: function() {
    return {
      cardData: {}
    };
  },
  methods: {}
};
</script>

<style></style>
