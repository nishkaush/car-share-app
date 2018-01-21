<template>
  <v-layout row>
    <v-flex xs12>
      <v-btn @click="signupAuthZero" class="orange">Signup</v-btn>
      <!-- <v-dialog v-model="dialog" max-width="500px">
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
        
      </v-dialog> -->
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  methods: {}
};
</script>
