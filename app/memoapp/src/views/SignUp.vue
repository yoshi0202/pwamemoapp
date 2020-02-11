<template>
  <v-content class="grey lighten-3">
    <v-container fluid pa-0 ma-0 fill-height>
      <v-layout align-center>
        <v-flex md6 offset-md3>
          <v-container>
            <v-card outlined tile>
              <v-card-title class="font-weight-bold headline white--text" style="background-color:black">
                <v-container text-center pa-0>ユーザ登録</v-container>
              </v-card-title>
              <v-container text-center fluid>
                <v-form>
                  <v-container py-5 px-12>
                    <v-text-field color="purple lighten-2" outlined dense v-model="email" label="Email"></v-text-field>
                    <v-text-field
                      color="purple lighten-2"
                      outlined
                      dense
                      v-model="password"
                      label="Password"
                      type="password"
                    ></v-text-field>
                    <v-text-field
                      color="purple lighten-2"
                      outlined
                      dense
                      v-model="reTypePassword"
                      label="Retype Password"
                      type="password"
                    ></v-text-field>
                  </v-container>
                  <v-btn large color="purple lighten-2" dark @click="signup" class="font-weight-bold">登録する </v-btn>
                </v-form>
              </v-container>
              <v-container fluid text-center>
                <v-btn text color="purple lighten-2" to="/login">アカウントをお持ちですか？</v-btn>
              </v-container>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
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
        const result = await axios.post(apiUrl + "auth/signUp", {
          email: this.email,
          password: this.password
        });
        await this.$store.dispatch("updateLoginStatus", {
          status: result.data.status,
          loginToken: result.data.loginToken,
          userId: result.data.userId,
          email: result.data.email,
          loginType: result.data.loginType,
          snipCounts: result.data.snipCounts,
          imgUrl: result.data.imgUrl
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
