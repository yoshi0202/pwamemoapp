<template>
  <v-app-bar app dark flat color="black" class="snippy-header">
    <v-layout justify="space-between">
      <v-container pa-0 class="d-flex align-center justify-start">
        <TopButton />
      </v-container>
      <v-container pa-0 class="d-flex align-center justify-end">
        <span v-if="$store.getters.getLoginStatus">
          <v-menu left offset-x>
            <template v-slot:activator="{ on }">
              <v-avatar v-on="on">
                <img :src="$store.getters.getImgUrl" alt="avator" style="cursor:pointer" />
              </v-avatar>
            </template>

            <v-list>
              <v-list-item @click="myPage" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-account</v-icon>
                    <span class="ml-3">マイページ</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="editPage" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-tune</v-icon>
                    <span class="ml-3">設定</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="$emit('logout')" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-logout</v-icon>
                    <span class="ml-3">ログアウト</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
        <span v-else>
          <v-btn outlined color="white" to="/signUp" class="white--text">
            <v-icon class="mr-2">mdi-account-plus</v-icon>
            <span>ユーザ登録</span>
          </v-btn>
          <v-btn class="white--text ma-2" to="/login">
            <v-icon class="mr-2">mdi-login-variant</v-icon>
            <span>ログイン</span>
          </v-btn>
        </span>
      </v-container>
    </v-layout>
  </v-app-bar>
</template>

<script>
import TopButton from "@/components/TopButton";

export default {
  Name: "Header",
  data: () => ({
    items: [{ title: "設定" }, { title: "ログアウト" }]
  }),
  components: {
    TopButton
  },
  created: function() {},
  methods: {
    myPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId);
    },
    editPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId + "/edit");
    }
  }
};
</script>

<style></style>
