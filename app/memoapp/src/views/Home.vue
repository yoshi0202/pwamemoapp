<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md3 pa-5 v-for="i in 30" :key="i">
        <Card />
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
  }
};
</script>
