import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./../components/Homepage/Home.vue";
import Profile from "./../components/Profile/Profile.vue";
import NewListing from "./../components/NewListing/NewListing.vue";
import { sessionIsValid } from "./../Store/Store.js";
import { store } from "./../Store/Store.js";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  routes: [{
    path: "/",
    component: Home
  }, {
    path: "/profile",
    component: Profile
  }, {
    path: "/new-listing",
    component: NewListing
  }, {
    path: "*",
    component: Home
    //added historyApiFallback: true, to webpack dev server
    //this removed the problem of page not loading on refresh and
    //also when user manually type in the path name in URL
  }]
});

router.beforeEach((to, from, next) => {
  if (to.path !== "/") {
    let loginStatus = false;
    let user = store.state.myPool.getCurrentUser();
    if (user !== null) {
      loginStatus = sessionIsValid(user);
      return loginStatus ? next() : next({ path: "/" });
    }
    next({ path: "/" });
  } else {
    next();
  }

});