<template>
  <!-- <v-layout row> -->
    <v-toolbar class="pt-2 pb-2">
      <v-toolbar-title 
      @click="$router.push('/')" 
      style="cursor:pointer;"
      >Car Share App</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <my-login v-if="loginStatus===false"></my-login>
        <my-signup v-if="loginStatus===false"></my-signup>
        <v-flex v-for="item in headerOptions" :key="item.text" v-if="loginStatus===true">
          <v-btn 
          large class="orange" 
          @click="item.path!=='/'?$router.push(item.path):logout(item.path)"
          >{{item.text}}</v-btn>
        </v-flex>
      </v-toolbar-items>
    </v-toolbar>
  <!-- </v-layout> -->
</template>

<script>
import Login from "./../Auth/Login.vue";
import Signup from "./../Auth/Signup.vue";
export default {
  data() {
    return {
      headerOptions: [
        { text: "My Profile", path: "/profile" },
        { text: "New Listing", path: "/new-listing" },
        { text: "Logout", path: "/" }
      ]
    };
  },
  methods: {
    logout(path) {
      let user = this.$store.state.myPool.getCurrentUser();
      if (user !== null) {
        user.signOut();
        this.$store.dispatch("changeLoginState", { valueToApply: false });
        this.$router.push(path);
      } else {
        console.log("while logging out user is null", user);
      }
    }
  },
  computed: {
    loginStatus() {
      return this.$store.state.loggedIn;
    },
    loggedInUser() {
      return this.$store.state.myPool.getCurrentUser()
        ? this.$store.state.myPool.getCurrentUser().username
        : "";
    }
  },
  components: {
    "my-signup": Signup,
    "my-login": Login
  }
};
</script>
