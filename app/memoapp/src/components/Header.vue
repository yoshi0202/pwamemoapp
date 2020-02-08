<template>
  <v-app-bar app dark color="#147F9B">
    <v-btn to="/" text class="#FDB436">
      <div class="d-flex align-center">Snippy</div>
    </v-btn>

    <v-spacer></v-spacer>

    <span v-if="$store.getters.getIsMobile">
      <v-icon color="#FDB436" @click="$store.dispatch('toggleDrawer')">mdi-menu</v-icon>
    </span>
    <span v-else>
      <span v-if="$store.getters.getLoginStatus">
        <v-avatar>
          <img :src="$store.getters.getImgUrl" alt="avator" @click="myPage" style="cursor:pointer" />
        </v-avatar>
        <v-menu bottom left>
          <template v-slot:activator="{ on }">
            <v-btn dark icon v-on="on">
              <v-icon>mdi-menu-down</v-icon>
            </v-btn>
          </template>

          <v-list>
            <v-list-item @click="myPage" style="cursor:pointer">
              <v-list-item-title
                ><span class="caption"
                  ><v-icon medium>mdi-account</v-icon>
                  <span class="ml-3">
                    マイページ
                  </span>
                </span></v-list-item-title
              >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item>
              <v-list-item-title @click="editPage" style="cursor:pointer"
                ><span class="caption"
                  ><v-icon medium>mdi-tune</v-icon>
                  <span class="ml-3">
                    設定
                  </span>
                </span></v-list-item-title
              >
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="$emit('logout')" style="cursor:pointer">
              <v-list-item-title>
                <span class="caption"
                  ><v-icon medium>mdi-logout</v-icon>
                  <span class="ml-3">
                    ログアウト
                  </span>
                </span></v-list-item-title
              >
            </v-list-item>
          </v-list>
        </v-menu>
      </span>
      <span v-else>
        <!-- <v-btn class="ma-2" outlined color="#FDB436" to="/signUp"> -->
        <v-btn outlined color="#FDB436" to="/signUp" class="white--text">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          <span>サインイン</span>
        </v-btn>
        <v-btn class="white--text ma-2" outlined color="#FDB436" to="/login">
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
