<template>
  <v-container>{{ snipData.data.Items }}</v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "MyPage",
  created: async function() {
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const userInfo = this.$store.getters.getLogin;
    this.snipData = await axios.get(apiUrl + "user/" + userInfo.userId + "/cards");
  },
  data: function() {
    return {
      snipData: {}
    };
  },
  methods: {}
};
</script>

<style></style>
