<template>
  <v-container fluid pa-0 ma-0 fill-height>
    <v-layout align-center>
      <v-flex md6 offset-md3>
        <v-container>
          <v-card>
            <v-container text-center headline pt-10>Snippy</v-container>
            <v-container text-center fluid pa-0 ma-0>
              <v-layout wrap>
                <v-flex xs12 md6>
                  <v-form ref="form">
                    <v-container pa-10 ma-0 fluid>
                      <v-text-field v-model="email" label="Email"></v-text-field>
                      <v-text-field v-model="password" label="Password" type="password"></v-text-field>
                    </v-container>
                    <v-layout px-10>
                      <v-flex md-6>
                        <v-btn large color="primary" @click="login">Login</v-btn>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-flex>
                <!-- <v-divider vertical></v-divider> -->
                <!-- <v-spacer></v-spacer> -->
                <v-flex xs12 md6>
                  <v-container fluid fill-height ma-0>
                    <v-container fluid text-center ma-0>
                      <v-btn
                        color="#DD4B39"
                        class="white--text"
                        width="100%"
                        :href="$store.getters.getApiUrl + 'auth/google'"
                      >
                        <v-icon>fab fa-google</v-icon>
                        <v-container>
                          Sign in with Google
                        </v-container>
                      </v-btn>
                    </v-container>
                    <v-container fluid text-center ma-0>
                      <v-btn
                        color="#71b7ee"
                        class="white--text"
                        width="100%"
                        :href="$store.getters.getApiUrl + 'auth/twitter'"
                      >
                        <v-icon>fab fa-twitter</v-icon>
                        <v-container>
                          Sign in with Twitter
                        </v-container>
                      </v-btn>
                    </v-container>
                    <v-container fluid text-center ma-0>
                      <v-btn
                        color="#444444"
                        class="white--text"
                        width="100%"
                        :href="$store.getters.getApiUrl + 'auth/github'"
                      >
                        <v-icon>fab fa-github</v-icon>
                        <v-container>
                          Sign in with GitHub
                        </v-container>
                      </v-btn>
                    </v-container>
                    <v-container fluid text-center ma-0>
                      <v-btn
                        color="#55C500"
                        class="white--text"
                        width="100%"
                        :href="$store.getters.getApiUrl + 'auth/qiita'"
                      >
                        <v-container>
                          Sign in with Qiita
                        </v-container>
                      </v-btn>
                    </v-container>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-container>
            <v-container fluid text-center ma-0>
              <v-btn text color="orange" to="/signUp">create new account</v-btn>
            </v-container>
          </v-card>
        </v-container>
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
      password: ""
    };
  },
  created: function() {},
  methods: {
    login: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        if (!this.email || !this.password) {
          alert("入力項目を確認してください。");
          return;
        }
        const result = await axios.post(apiUrl + "login", {
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
