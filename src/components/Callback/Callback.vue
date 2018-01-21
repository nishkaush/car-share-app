<template>
  <v-layout>
    <v-flex d-flex justify-content-center align-items-center>
      <v-progress-circular indeterminate :size="100" :width="7" color="orange"></v-progress-circular>
    </v-flex>
  </v-layout>
</template>


<script>
import { setIdToken } from "./../../utils/utils";

export default {
  created() {
    let vm = this;
    let idToken = setIdToken();
    if (idToken) {
      return this.$store
        .dispatch("changeLoginState", { valueToApply: true })
        .then(() => vm.$router.push("/"));
    }
    vm.$router.push("/");
  }
};
</script>
