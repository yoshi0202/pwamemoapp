<template>
  <v-footer absolute color="grey lighten-2 blue-grey--text text--darken-3">
    <v-container py-3 justify-start caption font-weight-bold :class="verticalPx">
      <span class="px-5">
        <a href="/policy" class="purple--text text--lighten-2">プライバシーポリシー</a>
      </span>
    </v-container>
    <v-container py-3 justify-start caption font-weight-bold :class="verticalPx">
      <span class="px-5">
        <a href="/terms" class="purple--text text--lighten-2">利用規約</a>
      </span>
    </v-container>
    <v-container py-3 justify-start caption font-weight-bold :class="verticalPx">
      <span class="px-5">
        <a href="/info" class="purple--text text--lighten-2">運用者情報</a>
      </span>
    </v-container>
    <!-- </v-container> -->
    <v-container pa-0 text-center font-weight-medium>©Snippy</v-container>
  </v-footer>
</template>

<script>
export default {
  Name: "Footer",
  data: function() {
    return {
      verticalPx: this.$store.getters.getIsMobile ? "px-0" : "px-12"
    };
  },
  components: {},
  created: function() {},
  methods: {}
};
</script>

<style></style>
