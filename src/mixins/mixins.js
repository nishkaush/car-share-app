import {
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";

export const loginMixin = {
  methods: {
    cognitoLogin(pool, username, password) {
      // errorAlert = false;
      let vm = this;
      let authDetails = new AuthenticationDetails({
        Username: username,
        Password: password
      });
      let cognitoUser = new CognitoUser({ Username: username, Pool: pool });
      return new Promise((resolve, reject) => {
        cognitoUser.authenticateUser(authDetails, {
          onSuccess(result) {
            vm.$store.dispatch("changeLoginState", { valueToApply: true });
            resolve({ value: false });
          },
          onFailure(err) {
            reject({ value: true });
          }
        });
      });

    }
  }
};