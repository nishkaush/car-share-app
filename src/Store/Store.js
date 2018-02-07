import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import decode from "jwt-decode";
import { sessionIsValid, getIdToken } from "./../utils/utils";

Vue.use(Vuex);

let loggedInValue = sessionIsValid() ? true : false;
let decodedToken = getIdToken() ? decode(getIdToken()) : null;
let currentUser = decodedToken ? decodedToken.name : null;

export const store = new Vuex.Store({
  state: {
    loggedIn: loggedInValue,
    adsArr: [],
    bidsForSingleAd: [],
    userAdsArr: [],
    currentSingleAd: "",
    loggedInUser: currentUser,
    bidsForAdArr: [],
    allBidsForSingleUser: [],
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
    },
    updateUserAdsArr(state, payload) {
      state.userAdsArr = payload.arr;
    },
    updateBidsForAdArr(state, payload) {
      state.bidsForAdArr = payload.arr;
    },
    updateBidsForSingleAd(state, payload) {
      state.bidsForSingleAd = payload.arr;
    },
    setAllBidsForSingleUser(state, payload) {
      state.allBidsForSingleUser = payload.arr;
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
    },
    changeUserAdsArr(context, payload) {
      context.commit("updateUserAdsArr", { arr: payload.userAds });
    }
  }
});
