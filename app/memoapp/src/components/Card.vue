<template>
  <v-card class="mx-auto" height="200" :elevation="elevation" @mouseover="elevation = 10" @mouseleave="elevation = 0">
    <v-list-item three-line>
      <v-list-item-content>
        <v-list-item-title class="headline mb-1">
          <v-container fluid px-0 pb-5>
            <v-layout>
              <v-flex>
                {{ data.title }}
              </v-flex>
              <v-flex>
                <v-container text-right fluid justify-start py-0 px-2>
                  <v-icon small :color="thumbtackColor" @click="changeThumbtackStatus">fas fa-thumbtack</v-icon>
                </v-container>
              </v-flex>
            </v-layout>
          </v-container>
        </v-list-item-title>
        <v-list-item-subtitle>{{ data.subTitle }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <div></div>
    <!-- <v-card-actions>
      <v-btn text>Button</v-btn>
      <v-btn text>Button</v-btn>
    </v-card-actions>-->
  </v-card>
</template>

<script>
export default {
  Name: "Card",
  data: () => ({
    elevation: "0",
    thumbtackColor: "grey"
  }),
  props: {
    data: Object
  },
  methods: {
    changeThumbtackStatus: function() {
      if (this.thumbtackColor === "orange lighten-2") {
        this.thumbtackColor = "grey";
      } else {
        this.thumbtackColor = "orange lighten-2";
      }
    }
  }
};
</script>

<style></style>
