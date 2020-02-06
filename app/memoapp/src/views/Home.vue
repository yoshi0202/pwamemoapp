<template>
  <v-container>
    <v-row justify="center" no-gutters>
      <v-col xs="12" sm="12" md="12" lg="12" xl="8">
        <v-row justify="center" no-gutters>
          <v-col v-if="!$store.getters.getIsMobile" cols="3">
            <CategoryMenu :menu="menu" />
          </v-col>
          <v-col xs="12" sm="12" md="9" lg="9" xl="9">
            <v-container pa-0 text-center>
              <Loading />
            </v-container>
            <v-card tile outlined v-for="sd in snipData" :key="sd.createdAt" class="border-bottom-none">
              <Card :data="sd" :userData="userData" />
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card";
import CategoryMenu from "@/components/CategoryMenu";
import Loading from "@/components/Loading";
import axios from "axios";

export default {
  name: "home",
  components: {
    Card,
    CategoryMenu,
    Loading
  },
  // computed: {},
  created: async function() {
    try {
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      const result = await axios.get(apiUrl + "snip");
      this.snipData = result.data.Items;
      this.userData = result.data.userData;
      console.log(this.userData);
      this.$store.dispatch("changeLoading", false);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  data: () => ({
    //   loading: true,
    snipData: [],
    userData: {},
    menu: [
      {
        name: "html",
        img: "html-5.svg"
      },
      {
        name: "Go",
        img: "go.svg"
      },
      {
        name: "Java",
        img: "java.svg"
      },
      {
        name: "JavaScript",
        img: "javascript.svg"
      },
      {
        name: "Node.JS",
        img: "nodejs-icon.svg"
      },
      {
        name: "PHP",
        img: "php.svg"
      },
      {
        name: "React",
        img: "react.svg"
      },
      {
        name: "Vue",
        img: "vue.svg"
      }
    ]
  })
  // methods: {}
};
</script>

<style>
.border-bottom-none {
  border-bottom: 0;
}
/* @media (min-width: 601px) and (max-width: 1920px) {
  .flex.lg5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}
@media (max-width: 600px) {
  .flex.lg5-custom {
    width: 100%;
    max-width: 100%;
    flex-basis: 100%;
  }
} */
</style>
