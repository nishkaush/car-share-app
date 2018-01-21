<template>
  <v-layout row>
    <v-flex xs12>
      <v-dialog v-model="dialog" max-width="500px">
       <v-btn slot="activator" large class="orange">Signup</v-btn>

          <v-card class="pb-3">
            <div class="text-xs-center sub-header pt-3 pb-3">
              <h2>Signup Form</h2>
            </div>
            <hr>
            <v-alert outline color="error" :value="errorAlert" class="text-xs-center">
              Invalid username or password
            </v-alert>
            <v-card-text>
              <v-text-field
              label="username"
              v-model="signupData.username"
              :rules="[(value)=>!!value||'Username is Required']"
              required
              ></v-text-field> 
              <v-text-field
              label="password"
              v-model="signupData.password"
              :rules="[(value)=>!!value||'Password is Required',(value)=>value.length>=6 || 'password should be atleast 6 characters long']"
              required
              ></v-text-field>
              <div class="text-xs-center">
                <v-btn large class="orange pl-4 pr-4" @click="cognitoSignup">Submit</v-btn>
              </div> 
            </v-card-text>        
          </v-card>
        
      </v-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails
} from "amazon-cognito-identity-js";
import { loginMixin } from "./../../mixins/mixins.js";
export default {
  data() {
    return {
      dialog: false,
      errorAlert: false,
      signupData: {
        username: "",
        password: ""
      }
    };
  },
  mixins: [loginMixin],
  methods: {
    cognitoSignup() {
      this.errorAlert = false;
      let pool = this.$store.state.myPool;
      let user = this.signupData.username;
      let pass = this.signupData.password;
      user && pass
        ? this.cognitoSignupPartTwo(user, pass, pool)
        : (this.errorAlert = true);
    },
    cognitoSignupPartTwo(username, password, pool) {
      let vm = this;
      pool.signUp(username, password, [], null, (err, result) => {
        if (err) {
          return (vm.errorAlert = true);
        }
        this.cognitoLogin(pool, username, password)
          .then(res => (vm.errorAlert = res.value))
          .catch(err => (vm.errorAlert = err.value));
      });
    }
  }
};
</script>
