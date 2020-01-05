<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md4 pa-5 v-for="cd in cardData" :key="cd" class="lg5-custom">
        <Card :data="cd" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card";
import axios from "axios";

export default {
  name: "home",
  components: {
    Card
  },
  mounted: async function() {
    try {
      const result = await axios.get("https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/cards");
      this.cardData = result.data.Items;
      console.log(this.cardData);
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  data: () => ({
    cardData: []
  }),
  methods: {
    pushCardData: function(data) {
      // this.cardData.push(data)
      this.cardData.push({
        title: data.cardTitle,
        subTitle: data.cardContents
      });
    }
  }
};
</script>

<style>
@media (min-width: 1264px) and (max-width: 1980px) {
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
}
</style>
