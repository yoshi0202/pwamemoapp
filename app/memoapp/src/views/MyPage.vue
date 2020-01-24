<template>
  <v-container>{{ cardData }}</v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPage",
  created: async function() {
    const userInfo = this.$store.getters.getLogin;
    this.cardData = await axios.get(
      "https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/" + userInfo.id + "/cards"
    );
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
