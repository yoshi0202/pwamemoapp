<template >
  <v-container pa-0 ma-0 fluid class="grey lighten-3">
    <v-content>
      <v-img src="/img/top.svg" class="grey lighten-3" max-height="500" aspect-ratio="1" contain>
        <template v-slot:default>
          <v-row class="fill-height" align="center" justify="left">
            <v-container class="app-title font-weight-bold black--text px-5 my-0 py-0">メモ感覚で</v-container>
            <v-container class="app-title font-weight-bold black--text px-10 text-left">共有しよう</v-container>
          </v-row>
        </template>
      </v-img>
    </v-content>
    <v-content class="white">aiueo</v-content>
    <v-content>aiueo</v-content>
    <v-content class="white">aiueo</v-content>
  </v-container>
</template>

<script>
export default {
  name: "Top"
};
</script>

<style scope>
.app-title {
  font-size: 80px;
}

.serif-sub {
  font-size: 32px;
}
@media (max-width: 600px) {
  .app-title {
    font-size: 10vw;
    margin: 0 !important;
    padding: 0 !important;
  }
  .serif-sub {
    font-size: 5vw;
  }
}
</style>
