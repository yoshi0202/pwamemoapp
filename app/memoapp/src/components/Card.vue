<template>
  <v-card
    class="mx-auto"
    height="300"
    :elevation="elevation"
    v-on:mouseover="hover"
    v-on:mouseleave="leave"
  >
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">テスト1</v-list-item-title>
        <v-list-item-subtitle>ttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttextexttexttexttext</v-list-item-subtitle>
      </v-list-item-content>

      <v-list-item-avatar tile size="80" color="grey"></v-list-item-avatar>
    </v-list-item>

    <!-- <v-card-actions>
      <v-btn text>Button</v-btn>
      <v-btn text>Button</v-btn>
    </v-card-actions>-->
  </v-card>
</template>

<script>
export default {
  Name: "Card",
  data: () => ({
    elevation: "0"
  }),
  methods: {
    hover: function() {
      this.elevation = "10";
    },
    leave: function() {
      this.elevation = "0";
    }
  }
};
</script>

<style>
</style>