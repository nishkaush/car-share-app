import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";
import { sessionIsValid } from "./../utils/utils";
Vue.use(Vuex);

let loggedInValue = sessionIsValid() ? true : false;
export const store = new Vuex.Store({
  state: {
    loggedIn: loggedInValue,
    adsArr: [
      { to: "lol", from: "lamo", adId: "343423vdfdsf", travelDate: "1-1-1" },
      { to: "lol", from: "lamo", adId: "343423vdfdsf", travelDate: "1-1-1" }
    ],
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
    preRefreshResults(state) {
      state.adsArr = [];
      state.LastEvaluatedKey = "nothing";
    },
    updateAdsArr(state, payload) {
      state.adsArr = [...state.adsArr, ...payload.Items];
      state.LastEvaluatedKey =
        payload.LastEvaluatedKey === undefined
          ? "nothing"
          : payload.LastEvaluatedKey;
    }
  },
  actions: {
    changeLoginState(context, payload) {
      context.commit("changeLoggedIn", { value: payload.valueToApply });
    },
    changeLoggedInUser(context, payload) {
      context.commit("setLoggedInUser", { user: payload.user });
    },
    getAds(context) {}
  }
});
