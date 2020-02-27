<template>
  <v-content class="grey lighten-3">
    <ErrorSnackbar v-if="$store.getters.getErrorMsg" />
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg8 xl6>
          <v-card tile elevation="0" class="menu-card">
            <v-container
              font-weight-bold
              d-flex
              justify-space-between
              align-center
              blue-grey--text
              text--darken-3
              title
            >
              <v-icon large>mdi-tune</v-icon>
              <span>設定</span>
              <span></span>
            </v-container>
          </v-card>
          <v-divider></v-divider>
          <v-card tile elevation="0">
            <v-container pa-5>
              <v-container pa-0>
                <v-form v-model="valid">
                  <v-layout wrap>
                    <v-flex xs12 sm12 md12 lg5 xl4>
                      <v-container pa-2 text-center>
                        <v-card outlined tile elevation="0">
                          <v-img
                            :lazy-src="userData.userData.imgUrl"
                            alt="avatar"
                            aspect-ratio="1"
                            class="grey lighten-2"
                            style="cursor: pointer;"
                            max-width="300"
                            max-height="300"
                            @click="imgClick"
                          >
                            <template v-slot:placeholder>
                              <v-row class="fill-height ma-0" align="center" justify="center">
                                <span class="display-1" style="color:#C7B967">Edit</span>
                                <v-icon size="100" color="#C7B967">mdi-image-edit-outline</v-icon>
                              </v-row>
                            </template>
                          </v-img>
                          <input
                            type="file"
                            style="display:none"
                            ref="fileUploads"
                            name="avatar"
                            @change="changeUserImg"
                          />
                        </v-card>
                      </v-container>
                    </v-flex>
                    <v-flex xs12 sm12 md12 lg7 xl8>
                      <v-container>
                        <form>
                          <v-text-field
                            color="purple lighten-2"
                            v-model="userData.userData.displayName"
                            outlined
                            label="表示名"
                            dense
                            :rules="[rules.required]"
                          ></v-text-field>
                          <v-textarea
                            color="purple lighten-2"
                            v-model="userData.userData.description"
                            outlined
                            label="説明"
                            dense
                          ></v-textarea>
                          <v-text-field
                            color="purple lighten-2"
                            v-model="userData.userData.url"
                            outlined
                            label="URL"
                            placeholder="https://*******/"
                            dense
                          ></v-text-field>
                          <v-text-field
                            color="purple lighten-2"
                            outlined
                            label="Twitter"
                            dense
                            placeholder="https://twitter.com/********"
                            v-model="userData.userData.twitter"
                          ></v-text-field>
                          <v-text-field
                            color="purple lighten-2"
                            outlined
                            label="GitHub"
                            dense
                            placeholder="https://github.com/********"
                            v-model="userData.userData.github"
                          ></v-text-field>
                          <v-text-field
                            color="purple lighten-2"
                            outlined
                            label="Qiita"
                            dense
                            placeholder="https://qiita.com/********"
                            v-model="userData.userData.qiita"
                          ></v-text-field>
                        </form>
                        <v-btn
                          v-if="userData.userData.displayName"
                          :disabled="!valid || !userData.userData.displayName.replace(/\s+/g, '')"
                          @click="updateUser"
                          class="font-weight-bold"
                          color="purple lighten-2 white--text"
                          style="bottom:10px; right:30px; position:absolute"
                          >プロフィールを更新する</v-btn
                        >
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-container>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
    <v-overlay :value="overlay">
      <v-progress-circular color="#C7B967" indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-content>
</template>

<script>
import axios from "axios";
import Store from "@/store/index.js";
import Loading from "@/components/Loading";
import ErrorSnackbar from "@/components/ErrorSnackbar";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  name: "EditMyPage",
  created: async function() {
    try {
      const userId = this.$route.params.userId;
      if (userId !== this.$store.getters.getUserId) {
        this.$router.push("/");
        return;
      }
      this.$store.dispatch("initializeErrorMsg");
      this.$store.dispatch("changeLoading", true);
      const result = await axios.get(apiUrl + "user/" + userId);
      this.userData = result.data;
      this.$store.dispatch("changeLoading", false);
    } catch (err) {
      this.$store.dispatch("updateErorrMsg");
      this.$store.dispatch("changeLoading", false);
    }
  },
  data: function() {
    return {
      overlay: false,
      valid: true,
      userData: {
        userData: ""
      },
      userId: "",
      userImg: "",
      rules: {
        required: v => !!v || "必須項目"
      }
    };
  },
  methods: {
    changeUserImg: async function(e) {
      try {
        this.overlay = true;
        e.preventDefault();
        let formData = new FormData();
        formData.append("avatar", e.target.files[0]);
        let config = {
          headers: {
            "content-type": "multipart/form-data"
          }
        };
        const result = await axios.post(apiUrl + "user/" + this.$route.params.userId + "/changeImg", formData, config);
        this.userData.userData.imgUrl = result.data.imageUrl;
        this.$store.dispatch("updateImgUrl", result.data.imageUrl);
        this.overlay = false;
      } catch (err) {
        this.overlay = false;
        this.$store.dispatch("updateErorrMsg");
      }
    },
    imgClick: function() {
      this.$refs.fileUploads.click();
    },
    updateUser: async function() {
      try {
        this.overlay = true;
        const userId = this.$route.params.userId;
        await axios.post(apiUrl + "user/" + userId + "/profile/update", {
          displayName: this.userData.userData.displayName,
          description: this.userData.userData.description,
          url: this.userData.userData.url,
          twitter: this.userData.userData.twitter,
          github: this.userData.userData.github,
          qiita: this.userData.userData.qiita
        });
        this.overlay = false;
        this.$router.push("/user/" + userId);
      } catch (err) {
        this.overlay = false;
        this.$store.dispatch("updateErorrMsg");
      }
    }
  },
  components: {
    Loading,
    ErrorSnackbar
  }
};
</script>

<style scoped>
.input-border {
  /* border-radius: 0; */
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.input-container-border {
  border-top-left-radius: 10;
  border-bottom-left-radius: inherit;
  border: solid;
}
</style>
