<template>
  <v-container>{{cardData}}</v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPage",
  mounted: async function() {
    const state = this.$store.getters.getLoginStatus;
    this.cardData = await axios.get(
      "https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/" + state.id + "/cards"
    );
  },
  data: function() {
    return {
      cardData: {}
    };
  },
  created: function() {},
  methods: {}
};
</script>

<style></style>
