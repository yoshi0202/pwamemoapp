<template>
  <v-container fluid pa-0 ma-0 fill-height>
    <v-layout align-center>
      <v-flex md6 offset-md3>
        <v-card>
          <v-container text-center headline pt-10>Snippy</v-container>
          <v-container text-center fluid>
            <v-form ref="form">
              <v-container pa-10>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="password" label="Password" type="password"></v-text-field>
              </v-container>
              <v-layout px-10 pb-10>
                <v-flex md-6>
                  <v-btn large color="primary" @click="login">Login</v-btn>
                </v-flex>
                <v-flex md-6>
                  <v-btn large color="secondary">SignUP</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: "Login",
  mounted: async function() {},
  data: function() {
    return {
      email: "",
      password: ""
    };
  },
  created: function() {},
  methods: {
    login: async function() {
      await this.$store.dispatch("updateLoginStatus", false);
      this.$router.push("/");
    }
  }
};
</script>

<style></style>
