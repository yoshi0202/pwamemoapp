import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import AddCard from "../views/AddCard.vue";
import showCard from "../views/showCard.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import Store from "@/store/index.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/addCard",
    name: "addCard",
    component: AddCard
  },
  {
    path: "/:user/card/:cardid",
    name: "showCard",
    component: showCard,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/signUp",
    name: "signUp",
    component: SignUp,
    meta: {
      isPublic: true
    }
  },
  {
    path: "*",
    name: "home",
    component: Home,
    meta: {
      isPublic: true
    }
  }
];

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const userStatus = Store.getters.getLoginStatus;

  if (to.matched.some(page => page.meta.isPublic) || userStatus.status) {
    next();
  } else {
    next("/login");
  }
});
export default router;
