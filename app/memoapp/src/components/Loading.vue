<template>
  <v-container v-if="$store.getters.getLoadingStatus" fluid>
    <v-progress-circular :size="70" color="#C7B967" indeterminate></v-progress-circular>
  </v-container>
</template>

<script>
export default {
  Name: "Loading",
  data: () => ({}),
  component: {},
  created: function() {},
  methods: {}
};
</script>

<style></style>
