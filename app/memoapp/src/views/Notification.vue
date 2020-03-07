<template>
  <v-content class="grey lighten-3">
    <v-container fluid fill-height>
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
              <v-icon large>mdi-bell-outline</v-icon>
              <span>通知</span>
              <span></span>
            </v-container>
          </v-card>
          <v-container pa-0>
            <v-divider></v-divider>
          </v-container>
          <v-card tile elevation="0">
            <v-container py-2>
              <v-card tile elevation="0" v-for="n in noti" :key="n.createdAt">
                <v-list class="pa-0">
                  <v-list-item>
                    <v-list-item-avatar>
                      <v-img :src="n.eventUserImgUrl"></v-img>
                    </v-list-item-avatar>

                    <v-list-item-content>
                      <v-list-item-title
                        class="font-weight-bold subtitle-1 blue-grey--text text--darken-3"
                      >
                        <a
                          :href="'/user/' + n.eventUserId"
                          class="purple--text text--lighten-2"
                        >{{ n.displayName }}</a>
                        さんが
                        <a
                          :href="'/' + $store.getters.getUserId + '/snip/' + n.snipId"
                          class="purple--text text--lighten-2"
                        >{{ n.snipTitle }}</a>
                        をピン留めしました！
                      </v-list-item-title>
                      <v-list-item-subtitle
                        v-text="changeUnixTime(n.createdAt, 'getFullTimestamp')"
                      ></v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";
import Mixin from "../mixin/mixin";

export default {
  name: "Notification",
  data: function() {
    return {
      noti: []
    };
  },
  created: async function() {
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const notify = apiUrl + "user/" + this.$store.getters.getUserId + "/notification";
    const getNotification = await axios.get(notify);
    this.noti = getNotification.data;
    this.$store.dispatch("notify", false);
  },
  mixins: [Mixin]
};
</script>

<style scope></style>
