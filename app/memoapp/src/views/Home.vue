<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex v-if="!$store.getters.getIsMobile" md2>
        <CategoryMenu :menu="menu" />
      </v-flex>
      <v-flex md10>
        <v-layout text-center wrap>
          <v-flex lg3 md6 xs12 pa-5 v-for="sd in snipData" :key="sd.createdAt" class="lg5-custom">
            <Card :data="sd" :userData="userData" />
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card";
import CategoryMenu from "@/components/CategoryMenu";
import axios from "axios";

export default {
  name: "home",
  components: {
    Card,
    CategoryMenu
  },
  computed: {},
  created: async function() {
    try {
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      const result = await axios.get(apiUrl + "snip");
      this.snipData = result.data.Items;
      this.userData = result.data.userData;
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  data: () => ({
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
  }),
  methods: {}
};
</script>

<style>
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
