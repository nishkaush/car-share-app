<template>
  <v-layout>
    <v-flex d-flex justify-content-center align-items-center>
      <v-progress-circular indeterminate :size="100" :width="7" color="orange"></v-progress-circular>
    </v-flex>
  </v-layout>
</template>


<script>
import { setIdToken } from "./../../utils/utils";
import decode from "jwt-decode";
export default {
  created() {
    let vm = this;
    let idToken = setIdToken();
    if (idToken) {
      //SEND A REQUEST TO GRAPHQL TO SAVE THIS BLODDDY USER!!!!
      //USE VUE-APOLLO/
      //dispatch action to post a request to graphql query
      //make this action store the current username in VUEX
      //call decode(idToken) ==> response.name=email
      return this.$store
        .dispatch("changeLoginState", { valueToApply: true })
        .then(() => vm.$router.push("/"));
    }
    vm.$router.push("/");
  }
};
</script>
