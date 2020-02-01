import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import EditCard from "../views/EditCard.vue";
import showCard from "../views/showCard.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import MyPage from "../views/MyPage.vue";
import Store from "@/store/index.js";
import Axios from "axios";
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
  mode: "history",
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
router.afterEach(async to => {
  if (to.query.userId) {
    const result = await Axios.post("http://localhost:3000/auth/google/signin", {
      userId: to.query.userId,
      loginType: to.query.loginType
    });
    console.log(JSON.stringify(result.data.Items[0]));
    await Store.dispatch("updateLoginStatus", {
      userId: result.data.Items[0].userId,
      email: result.data.Items[0].email,
      loginType: result.data.Items[0].loginType,
      snipCounts: result.data.Items[0].snipCounts,
      status: true,
      loginToken: result.data.Items[0].loginToken
    });
    router.push("/");
  }
  // next();
});
export default router;
