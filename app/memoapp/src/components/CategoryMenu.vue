<template>
  <v-container text-center pa-0 ma-0 style="position:sticky; top:64px;">
    <v-card outlined elevation="0" class="border-none">
      <v-toolbar color="#147F9B" flat dense dark elavation="0" class="border-none">
        <v-toolbar-title>Languages</v-toolbar-title>
      </v-toolbar>
      <v-list dense color="grey lighten-3" class="border-none">
        <v-list-item-group v-model="item" color="primary">
          <v-list-item v-for="(m, i) in menu" :key="i">
            <v-list-item-icon>
              <img :src="'img/' + m.img" style="max-width:30px;max-height:auto" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="m.name"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
export default {
  Name: "CategoryMenu",
  data: () => ({
    item: 1,
    items: [
      { text: "Real-Time", icon: "mdi-clock" },
      { text: "Audience", icon: "mdi-account" },
      { text: "Conversions", icon: "mdi-flag" }
    ]
  }),
  props: {
    menu: Array
  },
  component: {},
  created: function() {},
  methods: {}
};
</script>

<style>
.border-none {
  border-right: 0 !important;
  border-radius: 0 !important;
}
</style>
