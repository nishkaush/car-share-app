import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { sessionIsValid } from "./../utils/utils";
Vue.use(Vuex);

let loggedInValue = sessionIsValid() ? true : false;
export const store = new Vuex.Store({
  state: {
    loggedIn: loggedInValue,
    adsArr: [],
    currentSingleAd: "",
    loggedInUser: "",
    LastEvaluatedKey: "nothing"
  },
  mutations: {
    changeLoggedIn(state, payload) {
      state.loggedIn = payload.value;
    },
    setLoggedInUser(state, payload) {
      state.loggedInUser = payload.user;
    },
    emptyAdsArr(state) {
      state.adsArr = [];
    },
    updateAdsArr(state, payload) {
      state.adsArr = [...state.adsArr, ...payload.allAdsArr];
    },
    setSingleAd(state, payload) {
      state.currentSingleAd = payload.singleAd;
    }
  },
  actions: {
    changeLoginState(context, payload) {
      context.commit("changeLoggedIn", { value: payload.valueToApply });
    },
    changeLoggedInUser(context, payload) {
      context.commit("setLoggedInUser", { user: payload.user });
    },
    changeAdsArr(context, payload) {
      context.commit("updateAdsArr", { allAdsArr: payload.arr });
    },
    changeSingleAd(context, payload) {
      context.commit("setSingleAd", { singleAd: payload.ad });
    }
  }
});
