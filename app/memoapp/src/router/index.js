import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AddCard from "../views/AddCard.vue";
import showCard from "../views/showCard.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "home",
    component: Home
  },
  {
    path: "/addCard",
    name: "addCard",
    component: AddCard
  },
  {
    path: "/:user/card/:id",
    name: "showCard",
    component: showCard
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
