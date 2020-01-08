<template>
  <v-container fluid pa-0 ma-0 fill-height>
    <v-layout align-center>
      <v-flex md6 offset-md3>
        <v-card>
          <v-container text-center headline>Snippy</v-container>
          <v-container text-center fluid>
            <v-form ref="form">
              <v-text-field v-model="email" label="Email"></v-text-field>
              <v-text-field v-model="password" label="Password" type="password"></v-text-field>
              <v-layout>
                <v-flex md-6>
                  <v-btn large color="primary" @click="alertFunc">Login</v-btn>
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
    alertFunc: function() {
      alert(this.email);
      alert(this.password);
    }
  }
};
</script>

<style></style>
