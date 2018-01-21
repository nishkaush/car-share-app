<template>
  <v-layout row>
    <v-flex xs12>
      <!-- <v-btn @click="loginAuthZero">Login with Auth0</v-btn> -->
      <v-dialog v-model="dialog" max-width="500px">
       <v-btn slot="activator" large class="orange">Login</v-btn>

          <v-card class="pb-3">
            <div class="text-xs-center sub-header pt-3 pb-3">
              <h2>Login Form</h2>
            </div>
            <hr>
            <v-alert outline color="error" :value="error" class="text-xs-center">
              Username or password is invalid
            </v-alert>
            <v-card-text>
              <v-text-field
              label="username"
              v-model="loginData.username"
              :rules="[(value)=>!!value||'Username is Required']"
              required
              ></v-text-field> 
              <v-text-field
              label="password"
              v-model="loginData.password"
              :rules="[(value)=>!!value||'Password is Required',(value)=>value.length>=6 || 'password should be atleast 6 characters long']"
              required
              ></v-text-field>
              <div class="text-xs-center">
                <v-btn large class="orange pl-4 pr-4" @click.native="login" :loading="loading">Submit</v-btn>
              </div> 
            </v-card-text>        
          </v-card>
        
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import { loginMixin } from "./../../mixins/mixins.js";
import auth0 from "auth0-js";

export default {
  data() {
    return {
      loading: false,
      dialog: false,
      error: false,
      loginData: {
        username: "",
        password: ""
      }
    };
  },
  mixins: [loginMixin],
  methods: {
    loginAuthZero() {
      let myAuth = new auth0.WebAuth({
        domain: "pms.au.auth0.com",
        clientID: "zaXwVRlWiIf2my9Fbp3bjz9GScbtqf5r",
        redirectUri: "http://localhost:8080",
        audience: "https://pms.au.auth0.com/userinfo",
        responseType: "token id_token",
        scope: "openid"
      });
      myAuth.authorize();
    },
    login() {
      this.loading = true;
      let user = this.loginData.username;
      let pass = this.loginData.password;
      user && pass ? this.loginPartTwo(user, pass) : (this.error = true);
    },
    loginPartTwo(username, password) {
      let vm = this;
      vm.error = false;
      let pool = this.$store.state.myPool;
      this.cognitoLogin(pool, username, password)
        .then(res => {
          vm.loading = false;
          vm.error = res.value;
        })
        .catch(err => {
          vm.loading = false;
          vm.error = err.value;
        });
    }
  }
};
</script>
