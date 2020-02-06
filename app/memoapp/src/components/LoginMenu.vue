<template>
  <v-container pa-0>
    <v-list-item v-for="li in loginItems" :key="li.title">
      <v-list-item-icon>
        <v-icon>{{ li.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title @click="execAction(li.action)">{{ li.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>

<script>
export default {
  Name: "NavigationDrawer",
  data: () => ({
    loginItems: [
      { title: "My Page", icon: "mdi-account", action: "mypage" },
      { title: "Setting", icon: "mdi-tune", action: "setting" },
      { title: "Logout", icon: "mdi-logout", action: "logout" }
    ]
  }),
  created: function() {},
  methods: {
    execAction: function(path) {
      const user = this.$store.getters.getLogin;
      switch (path) {
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
