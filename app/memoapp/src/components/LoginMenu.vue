<template>
  <v-container pa-0>
    <v-list-item v-for="li in loginItems" :key="li.title">
      <v-list-item-avatar size="20px">
        <v-icon class="px-2">{{ li.icon }}</v-icon>
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title
          @click="execAction(li.action)"
          class="font-weight-bold caption blue-grey--text text--darken-3"
          >{{ li.title }}</v-list-item-title
        >
      </v-list-item-content>
      <v-list-item-action>
        <v-icon color="blue-grey darken-3">mdi-chevron-right</v-icon>
      </v-list-item-action>
    </v-list-item>
  </v-container>
</template>

<script>
export default {
  Name: "NavigationDrawer",
  data: () => ({
    loginItems: [
      { title: "マイページ", icon: "mdi-account", action: "mypage" },
      { title: "通知", icon: "mdi-bell-outline", action: "userNotification" },
      { title: "設定", icon: "mdi-tune", action: "setting" },
      { title: "ログアウト", icon: "mdi-logout", action: "logout" }
    ]
  }),
  created: function() {},
  methods: {
    execAction: function(path) {
      const user = this.$store.getters.getLogin;
      switch (path) {
        case "userNotification":
          this.$router.push("/user/" + user.userId + "/notification");
          break;
        case "mypage":
          this.$router.push("/user/" + user.userId);
          break;
        case "setting":
          this.$router.push("/user/" + user.userId + "/edit");
          break;
        case "logout":
          this.$emit("logout");
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style></style>
