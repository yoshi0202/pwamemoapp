<template>
  <v-container pa-0 text-center>
    <v-list-item v-for="li in logoutItems" :key="li">
      <v-list-item-icon>
        <v-icon class="px-2">{{ li.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title @click="execAction(li.action)">{{ li.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-container>
</template>

<script>
export default {
  Name: "LogoutMenu",
  data: () => ({
    logoutItems: [{ title: "Login", icon: "mdi-login", action: "/login" }]
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
