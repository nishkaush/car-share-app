import Vue from "vue";
import VueRouter from "vue-router";
import Home from "./../components/Homepage/Home.vue";
import Profile from "./../components/Profile/Profile.vue";
import NewListing from "./../components/NewListing/NewListing.vue";
import Callback from "./../components/Callback/Callback.vue";
import { store } from "./../Store/Store.js";
import { sessionIsValid } from "./../utils/utils";

Vue.use(VueRouter);

export const router = new VueRouter({
  mode: "history",
  routes: [
    {
      path: "/",
      component: Home
    },
    {
      path: "/profile",
      component: Profile,
      beforeEnter: (to, from, next) => {
        sessionIsValid() ? next() : next("/");
      }
    },
    {
      path: "/new-listing",
      component: NewListing,
      beforeEnter: (to, from, next) => {
        sessionIsValid() ? next() : next("/");
      }
    },
    {
      path: "/callback",
      component: Callback
    },
    {
      path: "*",
      component: Home
      //added historyApiFallback: true, to webpack dev server
      //this removed the problem of page not loading on refresh and
      //also when user manually type in the path name in URL
    }
  ]
});
