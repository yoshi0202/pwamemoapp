import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import EditCard from "../views/EditCard.vue";
import ShowCard from "../views/ShowCard.vue";
import Login from "../views/Login.vue";
import Notification from "../views/Notification.vue";
import SignUp from "../views/SignUp.vue";
import MyPage from "../views/MyPage.vue";
import EditMyPage from "../views/EditMyPage.vue";
import About from "../views/About.vue";
import PrivacyPolicy from "../views/PrivacyPolicy.vue";
import Terms from "../views/Terms.vue";
import Info from "../views/Info.vue";
import Store from "@/store/index.js";
import Axios from "axios";
Vue.use(VueRouter);

const routes = [
  {
    path: "/info",
    name: "info",
    component: Info,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/terms",
    name: "terms",
    component: Terms,
    meta: {
      isPublic: true
    }
  },
  {
    path: "/policy",
    name: "privacyPolicy",
    component: PrivacyPolicy,
    meta: {
      isPublic: true
    }
  },
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
    path: "/user/:userId/notification",
    name: "userNotification",
    component: Notification
  },
  {
    path: "/user/:userId/edit",
    name: "editMyPage",
    component: EditMyPage
  },
  {
    path: "/:userId/snip/:snipId",
    name: "ShowCard",
    component: ShowCard,
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
    const apiUrl = Store.getters.getApiUrl;
    const result = await Axios.post(apiUrl + "auth/" + to.query.loginType + "/signin", {
      userId: to.query.userId,
      loginType: to.query.loginType
    });
    if (result.data.Items[0].notifyFlg === 1) {
      Store.dispatch("notify", true);
    } else {
      Store.dispatch("notify", false);
    }
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
