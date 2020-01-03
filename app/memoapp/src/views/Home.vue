<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md4 pa-5 v-for="(cd, i) in cardData" :key="cd" class="lg5-custom">
        <Card :data="cardData[i]" />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
// @ is an alias to /src
import Card from "@/components/Card";

export default {
  name: "home",
  components: {
    Card
  },
  created: function() {
    for (let i = 0; i < 30; i++) {
      this.cardData.push({
        id: i,
        title: "title" + i,
        subTitle: "subTitle" + i
      });
    }
    console.log(this.cardData);
  },
  data: () => ({
    cardData: []
  })
};
</script>

<style>
@media (min-width: 1264px) and (max-width: 1903px) {
  .flex.lg5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}
</style>
