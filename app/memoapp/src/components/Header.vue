<template>
  <v-app-bar app dark class="orange lighten-2">
    <v-btn to="/" text>
      <div class="d-flex align-center">PWA Memo APP</div>
    </v-btn>

    <v-spacer></v-spacer>

    <v-btn to="addCard" text>
      <span class="mr-2">add Cards!</span>
      <v-icon small>fas fa-edit</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  Name: "Header"
};
</script>

<style></style>
