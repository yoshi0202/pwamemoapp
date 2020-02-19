<template>
  <v-content class="grey lighten-3">
    <v-container v-if="$store.getters.getErrorMsg" text-center>{{ $store.getters.getErrorMsg }}</v-container>
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fluid>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="10" xl="8">
          <v-row justify="center" no-gutters>
            <v-col v-if="!$store.getters.getIsMobile" md="2" lg="2" xl="2">
              <v-container px-0 py-8 my-8 style="position:sticky; top:30px;">
                <CategoryMenu @clickMenu="clickMenu" />
              </v-container>
            </v-col>
            <v-col xs="12" sm="12" md="6" lg="6" xl="6">
              <v-container px-0 v-if="$store.getters.getIsMobile">
                <Search />
              </v-container>
              <!-- <v-container d-flex py-0>
                <v-spacer></v-spacer>
                <v-card
                  class="md12 border-bottom-none pa-3"
                  color="transparent"
                  outlined
                  tile
                  :width="!$store.getters.getIsMobile ? '100%' : '100%'"
                >
                  <v-select
                    v-model="sortKey"
                    color="purple lighten-2"
                    item-color="purple"
                    dense
                    hide-details
                    label="並び替え"
                    :menu-props="{ bottom: true, offsetY: true }"
                    :items="['New Snippets', 'Most Viewd', 'Most Pin Counts']"
                  ></v-select>
                </v-card>
              </v-container>-->
              <v-container>
                <v-container px-0 pt-5 pb-0 d-flex justify-start align-end>
                  <span class="font-weight-black headline">投稿されたスニペット</span>
                  <v-spacer></v-spacer>
                  <v-btn tile depressed small color="grey lighten-3" class="pa-1">
                    <v-icon>mdi-code-tags</v-icon>新規投稿順
                  </v-btn>
                  <v-btn tile depressed small color="grey lighten-3" class="pa-1">
                    <v-icon>mdi-pin</v-icon>ピン数順
                  </v-btn>
                  <v-btn tile depressed small color="grey lighten-3" class="pa-1">
                    <v-icon>mdi-eye</v-icon>閲覧数順
                  </v-btn>
                </v-container>
                <v-divider></v-divider>
              </v-container>
              <v-container
                py-0
                v-for="sd in snipData"
                :key="sd.createdAt"
                :class="$store.getters.getIsMobile ? 'px-0' : 'px-3'"
              >
                <Card :data="sd" :userData="userData" />
                <v-divider></v-divider>
              </v-container>
              <!-- <v-card tile v-for="sd in snipData" :key="sd.createdAt" class="border-bottom-none">
              </v-card>-->
            </v-col>
            <v-col v-if="!$store.getters.getIsMobile" md="3" lg="3" xl="3">
              <v-container px-0 py-8 my-8>
                <SnippetCounts />
              </v-container>
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
import Search from "@/components/Search";
import SnippetCounts from "@/components/SnippetCounts";
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  name: "home",
  components: {
    Card,
    CategoryMenu,
    Loading,
    Search,
    SnippetCounts
  },
  props: {},
  watch: {
    async $route(to) {
      try {
        this.$store.dispatch("changeLoading", false);
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

<style scoped>
.card-margin {
  margin-top: 1px;
}
</style>
