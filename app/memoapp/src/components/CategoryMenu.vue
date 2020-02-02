<template>
  <v-container text-center py-5 px-0 style="position:sticky; top:64px;">
    <v-card class="mx-auto" tile style="position:sticky; top:64px;">
      <v-list flat>
        <v-container text-center title>
          Languages
        </v-container>
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

<style></style>
