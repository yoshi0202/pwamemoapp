<template>
  <v-container fluid pa-0 ma-0 fill-height>
    <v-layout align-center>
      <v-flex md6 offset-md3>
        <v-card>
          <v-container text-center headline pt-10>Snippy</v-container>
          <v-container text-center body-1 pt-10>SignUp</v-container>
          <v-container text-center fluid>
            <v-form ref="form">
              <v-container pa-10>
                <v-text-field v-model="email" label="Email"></v-text-field>
                <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                <v-text-field v-model="reTypePassword" label="Retype Password" type="password"></v-text-field>
              </v-container>
              <v-layout px-10>
                <v-flex md-6>
                  <v-btn large color="primary" @click="signup">SignUp</v-btn>
                </v-flex>
                <v-flex md-6>
                  <v-btn large color="secondary" to="home">Cancel</v-btn>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
          <v-container fluid text-center>
            <v-btn text color="orange" to="/login">Login</v-btn>
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
  data: function() {
    return {
      email: "",
      password: "",
      reTypePassword: ""
    };
  },
  methods: {
    signup: async function() {
      try {
        if (!this.password || !this.reTypePassword || !this.email) {
          alert("入力箇所を確認してください。");
          return;
        }
        if (this.password !== this.reTypePassword) {
          alert("パスワードを正しく入力してください。");
          return;
        }
        const apiUrl = this.$store.getters.getApiUrl;
        const result = await axios.post(apiUrl + "/signUp", {
          email: this.email,
          password: this.password
        });
        await this.$store.dispatch("updateLoginStatus", {
          status: result.data.status,
          loginToken: result.data.loginToken,
          userId: result.data.userId,
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
