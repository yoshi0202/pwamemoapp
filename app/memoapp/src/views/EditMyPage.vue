<template>
  <v-container fill-height>
    <v-layout class="justify-center" wrap>
      <v-flex xs12 sm12 md12 lg10 xl8>
        <v-card outlined height="100%">
          <v-list-item style="background-color:#147F9B;" dark>
            <v-card-title class="py-6">
              <h1 class="font-weight-bold headline basil--text">User Settings</h1>
            </v-card-title>
          </v-list-item>
          <v-container pa-5>
            <v-container>
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg5 xl4>
                  <v-container fluid text-center>
                    <v-img
                      :lazy-src="userData.userData.imgUrl"
                      alt="avator"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      style="cursor: pointer;"
                      max-width="300"
                      max-height="300"
                      @click="imgClick"
                    >
                      <template v-slot:placeholder>
                        <v-row class="fill-height ma-0" align="center" justify="center">
                          <span class="display-1" style="color:#FDB436">Edit</span>
                          <v-icon size="100" color="#FDB436">mdi-image-edit-outline</v-icon>
                        </v-row>
                      </template>
                    </v-img>
                    <input type="file" style="display:none" ref="fileUploads" name="avatar" @change="changeUserImg" />
                  </v-container>
                </v-flex>
                <v-flex xs12 sm12 md12 lg7 xl8>
                  <form>
                    <v-text-field v-model="userData.userData.displayName" outlined label="表示名" dense></v-text-field>
                    <v-textarea v-model="userData.userData.description" outlined label="説明" dense></v-textarea>
                    <v-text-field
                      v-model="userData.userData.url"
                      outlined
                      label="URL"
                      placeholder="https://*******/"
                      dense
                    ></v-text-field>
                    <v-text-field
                      outlined
                      label="Twitter"
                      dense
                      placeholder="https://twitter.com/********"
                      v-model="userData.userData.twitter"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      label="GitHub"
                      dense
                      placeholder="https://github.com/********"
                      v-model="userData.userData.github"
                    ></v-text-field>
                    <v-text-field
                      outlined
                      label="Qiita"
                      dense
                      placeholder="https://qiita.com/********"
                      v-model="userData.userData.qiita"
                    ></v-text-field>
                  </form>
                  <v-container>
                    <v-btn
                      outlined
                      @click="updateUser"
                      color="#FDB436"
                      style="bottom:20px; right:32px; position:absolute"
                      >Profile Update</v-btn
                    >
                  </v-container>
                </v-flex>
              </v-layout>
            </v-container>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
// import Loading from "@/components/Loading";

export default {
  name: "EditMyPage",
  created: async function() {
    const userId = this.$route.params.userId;
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const result = await axios.get(apiUrl + "user/" + userId);
    this.userData = result.data;
    this.$store.dispatch("changeLoading", false);
  },
  data: function() {
    return {
      userData: {
        userData: ""
      },
      userId: "",
      userImg: ""
    };
  },
  methods: {
    // toSnip: function(userId, snippetsId) {
    //   this.$router.push("/" + userId + "/snip/" + snippetsId);
    // },
    // toSns: function(path) {
    //   window.open(path, "_blank");
    // },
    changeUserImg: async function(e) {
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      e.preventDefault();
      let formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      let config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      await axios.post(apiUrl + "user/" + this.$route.params.userId + "/changeImg", formData, config);
    },
    imgClick: function() {
      this.$refs.fileUploads.click();
    },
    updateUser: async function() {
      try {
        const userId = this.$route.params.userId;
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        await axios.post(apiUrl + "user/" + userId + "/profile/update", {
          displayName: this.userData.userData.displayName,
          description: this.userData.userData.description,
          url: this.userData.userData.url,
          twitter: this.userData.userData.twitter,
          github: this.userData.userData.github,
          qiita: this.userData.userData.qiita
        });
        this.$router.push("/user/" + userId);
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  },
  components: {
    // Loading
  }
};
</script>

<style scoped>
/* Helper classes */
/* .basil {
  background-color: #147f9b !important;
}
.basil--text {
  color: white !important;
} */
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
