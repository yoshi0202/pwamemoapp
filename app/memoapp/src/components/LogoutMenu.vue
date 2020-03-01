<template>
  <v-container pa-0>
    <v-list-item v-for="li in logoutItems" :key="li.title">
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
  Name: "LogoutMenu",
  data: () => ({
    logoutItems: [
      // { title: "ユーザ登録", icon: "mdi-account-plus", action: "/signUP" },
      { title: "ログイン", icon: "mdi-login", action: "/login" }
    ]
  }),
  created: function() {},
  methods: {
    execAction: function(path) {
      this.$router.push(path);
    }
  }
};
</script>

<style></style>
