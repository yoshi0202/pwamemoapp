<template>
  <v-content class="grey lighten-3">
    <v-container v-if="$store.getters.getErrorMsg" text-center>{{ $store.getters.getErrorMsg }}</v-container>
    <v-container>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="12" xl="8">
          <v-row justify="center" no-gutters>
            <v-col v-if="!$store.getters.getIsMobile" cols="3">
              <v-container pa-0 my-12 style="position:sticky; top:64px;">
                <CategoryMenu @clickMenu="clickMenu" />
              </v-container>
            </v-col>
            <v-col xs="12" sm="12" md="9" lg="9" xl="9">
              <v-container pa-0 text-center>
                <Loading />
              </v-container>
              <v-layout>
                <v-spacer></v-spacer>
                <v-card
                  color="transparent"
                  tile
                  outlined
                  :width="!$store.getters.getIsMobile ? '40%' : '100%'"
                  class="border-bottom-none pb-3"
                >
                  <v-select
                    v-model="sortKey"
                    color="purple lighten-2"
                    item-color="purple"
                    dense
                    hide-details
                    label="Sort by"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :items="['New Snippets', 'Most Viewd', 'Most Pin Counts']"
                  ></v-select>
                </v-card>
              </v-layout>
              <v-card tile outlined v-for="sd in snipData" :key="sd.createdAt" class="border-bottom-none">
                <Card :data="sd" :userData="userData" />
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import Card from "@/components/Card";
import CategoryMenu from "@/components/CategoryMenu";
import Loading from "@/components/Loading";
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  name: "home",
  components: {
    Card,
    CategoryMenu,
    Loading
  },
  props: {},
  watch: {
    async $route(to) {
      try {
        this.$store.dispatch("changeLoading", true);
        const sortKey = to.query.sort ? to.query.sort : "New Snippets";
        const category = to.query.category ? to.query.category : "";
        const result = await axios.get(apiUrl + "snip?sort=" + sortKey + "&category=" + category);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (error) {
        this.$store.dispatch("changeLoading", false);
        this.$store.dispatch("updateErorrMsg");
      }
    },
    async sortKey(v) {
      try {
        this.$store.dispatch("changeLoading", true);
        const result = await axios.get(apiUrl + "snip?sort=" + v);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (err) {
        this.$store.dispatch("changeLoading", false);
        this.$store.dispatch("updateErorrMsg");
      }
    }
  },
  created: async function() {
    try {
      const category = this.$route.query.category ? this.$route.query.category : "";
      const result = await axios.get(apiUrl + "snip?sort=New Snippets&category=" + category);
      this.snipData = result.data.Items;
      this.userData = result.data.userData;
      this.$store.dispatch("changeLoading", false);
      this.$store.dispatch("initializeErrorMsg");
    } catch (err) {
      console.log(err);
      this.$store.dispatch("updateErorrMsg");
    }
  },
  data: () => ({
    // loading: true,
    snipData: [],
    userData: {},
    sortKey: "New Snippets"
    // selectedMenu: null
  }),
  methods: {
    clickMenu: async function(l) {
      try {
        this.$store.dispatch("changeLoading", true);
        const result = await axios.get(apiUrl + "snip?sort=" + this.sortKey + "&category=" + l);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (err) {
        this.$store.dispatch("changeLoading", false);
      }
    }
  }
};
</script>

<style>
.border-bottom-none {
  border-bottom: 0;
}
</style>
