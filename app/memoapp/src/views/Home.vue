<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md4 pa-5 v-for="i in 30" :key="i" class="lg5-custom">
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

<style>
@media (min-width: 1264px) and (max-width: 1903px) {
  .flex.lg5-custom {
    width: 20%;
    max-width: 20%;
    flex-basis: 20%;
  }
}
</style>