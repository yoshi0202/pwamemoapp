<template>
  <v-container pa-0>
    <v-btn to="/" text small color="purple lighten-2" class="text-center pa-0">
      <div class="d-flex align-center title pa-0">Snippy</div>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn small dark icon v-on="on">
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
  </v-container>
</template>

<script>
export default {
  Name: "TopButton"
};
</script>

<style></style>
