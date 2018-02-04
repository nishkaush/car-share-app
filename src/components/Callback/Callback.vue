<template>
  <v-layout>
    <v-flex d-flex justify-content-center align-items-center>
      <v-progress-circular indeterminate :size="100" :width="7" color="orange"></v-progress-circular>
    </v-flex>
  </v-layout>
</template>


<script>
import { setIdToken, getIdToken } from "./../../utils/utils";
import decode from "jwt-decode";
import gql from "graphql-tag";

export default {
  methods: {
    saveUserToDB(username) {
      let vm = this;
      const myMutation = gql`
        mutation($username: String!) {
          addUser(username: $username)
        }
      `;
      this.$apollo
        .mutate({ mutation: myMutation, variables: { username } })
        .then(res => {
          vm.$store.dispatch("changeLoggedInUser", { user: res.data.addUser });
          vm.$store.dispatch("changeLoginState", { valueToApply: true });
          vm.$router.push("/");
        })
        .catch(err => {
          return err;
        });
    }
  },
  created() {
    let vm = this;
    let isTokenSet = setIdToken();
    if (isTokenSet) {
      let decodedToken = decode(getIdToken());
      return this.saveUserToDB(decodedToken.name);
    }
    vm.$router.push("/");
  }
};
</script>
