<template>
  <v-content>
    <v-list-item v-for="li in logoutItems" :key="li">
      <v-list-item-icon>
        <v-icon>{{ li.icon }}</v-icon>
      </v-list-item-icon>

      <v-list-item-content>
        <v-list-item-title @click="execAction(li.action)">{{ li.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </v-content>
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
