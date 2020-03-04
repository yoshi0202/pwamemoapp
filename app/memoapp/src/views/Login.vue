<template>
  <v-content class="grey lighten-3">
    <v-container fluid pa-0 ma-0 fill-height>
      <v-layout align-center>
        <v-flex md4 offset-md4>
          <v-container>
            <v-card outlined tile>
              <v-card-title class="font-weight-bold headline black white--text py-3">
                <v-container text-left py-0 px-4>ログイン</v-container>
              </v-card-title>
              <v-container fluid d-flex justify-center>
                <!-- <v-flex xs12 sm12 md6>
                  <v-form>
                    <v-container pt-6 px-5>
                      <v-text-field
                        v-model="email"
                        outlined
                        dense
                        label="Email"
                        color="purple lighten-2"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-text-field
                        v-model="password"
                        outlined
                        dense
                        label="Password"
                        type="password"
                        color="purple lighten-2"
                        :rules="[rules.required]"
                      ></v-text-field>
                      <v-btn dark large color="purple lighten-2" class="font-weight-bold" @click="login"
                        >ログイン</v-btn
                      >
                    </v-container>
                  </v-form>
                </v-flex> -->
                <v-container px-5>
                  <v-container fluid text-center>
                    <v-btn
                      color="#DD4B39"
                      class="white--text"
                      width="100%"
                      :href="$store.getters.getApiUrl + 'auth/google'"
                    >
                      <v-icon>fab fa-google</v-icon>
                      <v-container>Sign in with Google</v-container>
                    </v-btn>
                  </v-container>
                  <v-container text-center font-weight-bold py-0>or</v-container>
                  <v-container fluid text-center>
                    <v-btn
                      color="#00acee"
                      class="white--text"
                      width="100%"
                      :href="$store.getters.getApiUrl + 'auth/twitter'"
                    >
                      <v-icon>fab fa-twitter</v-icon>
                      <v-container>Sign in with Twitter</v-container>
                    </v-btn>
                  </v-container>
                  <v-container text-center font-weight-bold py-0>or</v-container>
                  <v-container fluid text-center>
                    <v-btn
                      color="#171515"
                      class="white--text"
                      width="100%"
                      :href="$store.getters.getApiUrl + 'auth/github'"
                    >
                      <v-icon>fab fa-github</v-icon>
                      <v-container>Sign in with GitHub</v-container>
                    </v-btn>
                  </v-container>
                  <v-container text-center font-weight-bold py-0>or</v-container>
                  <v-container fluid text-center>
                    <v-btn
                      color="#55C500"
                      class="white--text"
                      width="100%"
                      :href="$store.getters.getApiUrl + 'auth/qiita'"
                    >
                      <v-icon>mdi-quora</v-icon>
                      <v-container>Sign in with Qiita</v-container>
                    </v-btn>
                  </v-container>
                </v-container>
              </v-container>
              <!-- <v-container fluid text-center ma-0>
                <v-btn text color="purple lighten-2" to="/signUp">アカウントをお持ちでない場合</v-btn>
              </v-container>-->
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
      rules: {
        required: v => !!v || "必須項目",
        regex: v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail must be valid"
      }
    };
  },
  created: function() {},
  methods: {
    login: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl;
        if (!this.email || !this.password) {
          alert("入力項目を確認してください。");
          return;
        }
        const result = await axios.post(apiUrl + "auth/login", {
          email: this.email,
          password: this.password
        });
        if (result.data.err) {
          alert(result.data.err);
          return;
        }
        await this.$store.dispatch("updateLoginStatus", {
          userId: result.data.userId,
          email: result.data.email,
          loginType: result.data.loginType,
          snipCounts: result.data.snipCounts,
          status: true,
          loginToken: result.data.loginToken,
          imgUrl: result.data.imgUrl,
          displayName: result.data.displayName
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
