import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import EditCard from "../views/EditCard.vue";
import showCard from "../views/showCard.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import MyPage from "../views/MyPage.vue";
import Store from "@/store/index.js";
Vue.use(VueRouter);

const routes = [
  {
    path: "/addCard",
    name: "addCard",
    component: EditCard
  },
  {
    path: "/:user/mypage",
    name: "myPage",
    component: MyPage
  },
  {
    path: "/:userId/snip/:snipId",
    name: "showCard",
    component: showCard,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/:userId/snip/:snipId/edit",
    name: "editCard",
    component: EditCard
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
  Store.dispatch("closeDrawer");
  if (to.matched.some(page => page.meta.isPublic) || Store.getters.getLoginStatus) {
    next();
  } else {
    next("/login");
  }
});
export default router;
