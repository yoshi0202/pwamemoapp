<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex lg3 md6 xs12 pa-5 v-for="sd in snipData" :key="sd.createdAt" class="lg5-custom">
        <Card :data="sd" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card";
import axios from "axios";

export default {
  name: "home",
  components: {
    Card
  },
  computed: {},
  created: async function() {
    try {
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      const result = await axios.get(apiUrl + "snip");
      this.snipData = result.data.Items;
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  data: () => ({
    snipData: []
  }),
  methods: {}
};
</script>

<style>
/* @media (min-width: 601px) and (max-width: 1920px) {
  .flex.lg5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}
@media (max-width: 600px) {
  .flex.lg5-custom {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
} */
</style>
