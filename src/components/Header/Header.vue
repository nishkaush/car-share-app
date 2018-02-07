<template>
  <!-- <v-layout row> -->
    <v-toolbar class="pt-2 pb-2">
      <v-toolbar-title 
      @click="$router.push('/')" 
      style="cursor:pointer;"
      >Car Share App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn 
        @click="loginAuthZero" 
        class="orange mr-2" 
        v-if="loginStatus===false"
        >Login
        </v-btn>
        <v-btn 
        @click="signupAuthZero" 
        class="orange" 
        v-if="loginStatus===false"
        >Signup
        </v-btn>
        <v-flex v-for="item in headerOptions" :key="item.text" v-if="loginStatus===true">
          <v-btn 
          large class="orange" 
          @click="item.path!=='/'?changeRoute(item.path):logout(item.path)"
          >{{item.text}}</v-btn>
        </v-flex>
      </v-toolbar-items>
    </v-toolbar>
  <!-- </v-layout> -->
</template>

<script>
import { login } from "./../../utils/utils";
import { clearAllTokens } from "./../../utils/utils";
export default {
  data() {
    return {
      headerOptions: [
        { text: "My Profile", path: "profile" },
        { text: "New Listing", path: "new-listing" },
        { text: "Logout", path: "/" }
      ]
    };
  },
  methods: {
    changeRoute(path) {
      this.$router.push({ path });
    },
    loginAuthZero() {
      login();
    },
    signupAuthZero() {
      login();
    },
    logout(path) {
      clearAllTokens();
      this.$store.dispatch("changeLoginState", { valueToApply: false });
      this.$store.dispatch("changeLoggedInUser", { user: null });
      this.$router.push("/");
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loggedIn;
    }
  }
};
</script>
