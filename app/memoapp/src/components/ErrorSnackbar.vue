<template>
  <v-snackbar top v-model="snack" outlined :timeout="0" color="red">
    <v-container>
      {{ $store.getters.getErrorMsg }}
    </v-container>
  </v-snackbar>
</template>

<script>
export default {
  Name: "ErrorSnackbar",
  data: function() {
    return {
      snack: this.$store.getters.getErrorMsg
    };
  }
};
</script>

<style></style>
