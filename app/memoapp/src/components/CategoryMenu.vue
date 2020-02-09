<template>
  <v-container text-center pa-0 ma-0 style="position:sticky; top:64px;">
    <v-card outlined elevation="0" class="border-none">
      <v-toolbar
        v-if="!$store.getters.getIsMobile"
        color="black"
        flat
        dense
        dark
        elavation="0"
        class="border-none"
      >
        <v-toolbar-title>Languages</v-toolbar-title>
      </v-toolbar>
      <v-list dense color="white" class="border-none">
        <v-list-item-group v-model="int">
          <v-list-item v-for="(m, i) in menu" :key="i" @click="changeCategory(m, i)">
            <v-list-item-icon>
              <img :src="'img/' + m + '.svg'" style="max-width:40px;max-height:auto" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="m"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
// import axios from "axios";

export default {
  Name: "CategoryMenu",
  data: function() {
    return {
      int: null
    };
  },
  watch: {
    // int: function(val) {
    //   console.log(val);
    // }
  },
  mounted: function() {
    this.int = Number(this.$route.query.menuId);
  },
  props: {
    menu: Array
  },
  component: {},
  methods: {
    changeCategory: async function(language, number) {
      // const apiUrl = this.$store.getters.getApiUrl + "api/";
      // const url = apiUrl + "snip/category/";
      // const result = await axios.get(url + "?l="+language)
      this.$router.push("/?l=" + language);
      console.log(number);
    }
  }
};
</script>

<style>
.border-none {
  border-right: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;
  border-radius: 0 !important;
}
</style>
