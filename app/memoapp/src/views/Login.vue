<template>
  <v-container fluid pa-0 ma-0 fill-height>
    <v-layout align-center>
      <v-flex md6 offset-md3>
        <v-card>
          <v-container text-center headline pt-10>Snippy</v-container>
          <v-container text-center body-1 pt-10>Login</v-container>
          <v-container text-center fluid>
            <v-form ref="form">
              <v-container pa-10>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="password" label="Password" type="password"></v-text-field>
              </v-container>
              <v-layout px-10>
                <v-flex md-6>
                  <v-btn large color="primary" @click="login">Login</v-btn>
                </v-flex>
                <v-flex md-6>
                  <v-btn large color="secondary" to="/">Cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
          <v-container fluid text-center>
            <v-btn text color="orange" to="/signUp">create new account</v-btn>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
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
      try {
        if (!this.email || !this.password) {
          alert("入力項目を確認してください。");
          return;
        }
        const result = await axios.post("https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/login", {
          email: this.email,
          password: this.password
        });
        if (result.data.err) {
          alert(result.data.err);
          return;
        }
        console.log(result);
        await this.$store.dispatch("updateLoginStatus", {
          userId: this.email,
          status: true,
          loginToken: result.data.loginToken,
          id: result.data.id
        });
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  }
};
</script>

<style></style>
