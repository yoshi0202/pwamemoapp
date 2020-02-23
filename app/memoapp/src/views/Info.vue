<template>
  <v-content class="grey lighten-3">
    <v-container fluid fill-height>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="10" xl="8">
          <v-row justify="center" no-gutters>
            <v-col xs="12" sm="12" md="8" lg="8" xl="8">
              <v-container pa-0>
                <v-card tile elavation="0" outlined>
                  <v-card tile elevation="0" class="menu-card" v-if="!$store.getters.getIsMobile">
                    <v-container
                      py-2
                      transparent
                      title
                      font-weight-bold
                      text-left
                      blue-grey--text
                      text--darken-3
                      d-flex
                      align-center
                      justify-space-between
                    >
                      <span></span>
                      <span>運用者情報</span>
                      <span></span>
                    </v-container>
                  </v-card>
                </v-card>
                <v-container pt-5 text-center>aiueo</v-container>
              </v-container>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  name: "PrivacyPolicy",
  data: function() {
    return {};
  }
};
</script>

<style scope>
</style>
