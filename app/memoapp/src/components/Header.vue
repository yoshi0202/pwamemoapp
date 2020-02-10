<template>
  <v-app-bar app dark flat color="black" class="snippy-header">
    <!-- <v-container text-center pa-0></v-container> -->
    <v-btn to="/" text small color="purple lighten-2" class="text-center">
      <div class="d-flex align-center title">Snippy</div>
    </v-btn>
    <v-menu offset-y>
      <template v-slot:activator="{ on }">
        <v-btn small dark icon v-on="on">
          <v-icon color="#C7B967">mdi-menu-down</v-icon>
        </v-btn>
      </template>

      <v-list>
        <v-list-item to="/top" style="cursor:pointer">
          <v-list-item-title>
            <span class="caption">
              <v-icon medium>mdi-information-outline</v-icon>
              <span class="ml-3">About</span>
            </span>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>

    <v-spacer></v-spacer>

    <span v-if="$store.getters.getIsMobile">
      <span v-if="$store.getters.getLoginStatus">
        <v-avatar>
          <img
            :src="$store.getters.getImgUrl"
            alt="avator"
            @click="$store.dispatch('toggleDrawer')"
            style="cursor:pointer"
          />
        </v-avatar>
      </span>
      <span v-else>
        <v-icon color="#C7B967" @click="$store.dispatch('toggleDrawer')">mdi-dots-vertical</v-icon>
      </span>
    </span>
    <span v-else>
      <span v-if="$store.getters.getLoginStatus">
        <v-avatar>
          <img :src="$store.getters.getImgUrl" alt="avator" @click="myPage" style="cursor:pointer" />
        </v-avatar>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon x-large color="#C7B967">mdi-menu-down</v-icon>
            </v-btn>
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
            <v-list-item>
              <v-list-item-title @click="editPage" style="cursor:pointer">
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
        <!-- <v-btn class="ma-2" outlined color="#FDB436" to="/signUp"> -->
        <v-btn outlined color="purple lighten-2" to="/signUp" class="white--text">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          <span>サインイン</span>
        </v-btn>
        <v-btn class="purple--text text--lighten-2 ma-2" outlined to="/login">
          <v-icon class="mr-2">mdi-login-variant</v-icon>
          <span>ログイン</span>
        </v-btn>
      </span>
    </span>
  </v-app-bar>
</template>

<script>
export default {
  Name: "Header",
  data: () => ({
    items: [{ title: "設定" }, { title: "ログアウト" }]
  }),
  component: {},
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
