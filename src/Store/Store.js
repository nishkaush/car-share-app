import Vue from "vue";
import Vuex from "vuex";
import { CognitoUserPool } from "amazon-cognito-identity-js";
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
    LastEvaluatedKey: "nothing"
  },
  mutations: {
    changeLoggedIn(state, payload) {
      state.loggedIn = payload.value;
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
    getAds(context) {
      let lastKey =
        context.state.LastEvaluatedKey === "nothing"
          ? "nothing"
          : context.state.LastEvaluatedKey.adId;
      let url = `https://6tty6nq7z1.execute-api.ap-southeast-2.amazonaws.com/dev/get-ads/${lastKey}`;
      return axios
        .get(url)
        .then(res => {
          context.commit("updateAdsArr", res.data);
          return "All is well in Vuex Actions";
        })
        .catch(err => {
          return "Shit went sideways in Vuex Actions";
          //make the adsArr=[] and let that show "No ads to show" on main screen
        });
    }
  }
});
