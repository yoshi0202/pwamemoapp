<template>
  <span :class="margin">
    <v-btn to="/" text small color="purple lighten-2" class="text-center pa-0">
      <div class="d-flex align-center title pa-0 title-logo">Snippy(β)</div>
    </v-btn>
    <v-menu offset-y v-if="!$store.getters.getIsMobile">
      <template v-slot:activator="{ on }">
        <v-btn large dark icon v-on="on">
          <v-icon color="#C7B967">mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list dense>
        <v-list-item to="/about" style="cursor:pointer">
          <v-list-item-title>
            <span class="caption">
              <v-icon medium>mdi-information-outline</v-icon>
              <span class="ml-3">Snippyについて</span>
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </span>
</template>

<script>
export default {
  Name: "TopButton",
  data: function() {
    return {
      margin: this.$store.getters.getIsMobile ? "ml-5" : "mr-5"
    };
  }
};
</script>

<style scoped>
.v-btn:before,
.v-btn--active::before {
  background-color: "transparent" !important;
  opacity: 0 !important;
}
</style>
