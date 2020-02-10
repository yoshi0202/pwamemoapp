import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import EditCard from "../views/EditCard.vue";
import showCard from "../views/showCard.vue";
import Login from "../views/Login.vue";
import SignUp from "../views/SignUp.vue";
import MyPage from "../views/MyPage.vue";
import EditMyPage from "../views/EditMyPage.vue";
import About from "../views/About.vue";
import Store from "@/store/index.js";
import Axios from "axios";
Vue.use(VueRouter);

const routes = [
  {
    path: "/about",
    name: "about",
    component: About,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/addSnippets",
    name: "addSnippets",
    component: EditCard
  },
  {
    path: "/user/:userId",
    name: "myPage",
    component: MyPage,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/user/:userId/edit",
    name: "editMyPage",
    component: EditMyPage
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
  Store.dispatch("changeLoading", true);
  if (to.matched.some(page => page.meta.isPublic) || Store.getters.getLoginStatus) {
    next();
  } else {
    next("/login");
  }
});
router.afterEach(async to => {
  if (to.query.userId) {
    const apiUrl = Store.getters.getApiUrl;
    const result = await Axios.post(apiUrl + "auth/" + to.query.loginType + "/signin", {
      userId: to.query.userId,
      loginType: to.query.loginType
    });
    await Store.dispatch("updateLoginStatus", {
      userId: result.data.Items[0].userId,
      email: result.data.Items[0].email,
      loginType: result.data.Items[0].loginType,
      snipCounts: result.data.Items[0].snipCounts,
      status: true,
      loginToken: result.data.Items[0].loginToken,
      imgUrl: result.data.Items[0].imgUrl
    });
    router.push("/");
  }
});
export default router;
