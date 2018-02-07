<template>
  <div>
    <v-snackbar
      :timeout="timeout"
      :top="top"
      v-model="snackbar"
    >
    Please Login to place bids
      <v-btn flat color="orange" @click.native="snackbar = false">Close</v-btn>
    </v-snackbar>


    <v-btn @click="checkLoginStatus">Place a Bid</v-btn>
    <v-dialog v-model="placeBidDialog" max-width="500" persistent>
      <v-card class="pa-3">
        <v-card-text v-if="successful===true" class="text-xs-center">
          <div class="text-xs-center pb-3"><v-icon dark x-large color="green">check_circle</v-icon></div>
          <h3>Your Bid was posted successfully!</h3>
          <div><v-btn class="orange mt-3" @click="closeDialogBox">Close</v-btn></div>
        </v-card-text>
        <v-card-text v-else>
          <v-text-field label="Enter a Bid in $" v-model="bidPrice" mask="#####"></v-text-field>
          <v-btn class="orange" @click="submitBid" :loading="loadingIcon">Submit</v-btn>
          <v-btn @click="closeDialogBox" class="orange">Close</v-btn>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { placeBid } from "./../../Apollo/mutations";
export default {
  props: ["adId", "toPlace", "fromPlace"],
  data() {
    return {
      placeBidDialog: false,
      bidPrice: "",
      successful: false,
      loadingIcon: false,
      loginStatus: this.$store.state.loggedIn,
      snackbar: false,
      timeout: 6000,
      top: "top"
    };
  },
  methods: {
    checkLoginStatus() {
      this.loginStatus ? (this.placeBidDialog = true) : (this.snackbar = true);
    },
    closeDialogBox() {
      this.placeBidDialog = false;
      this.successful = false;
    },
    submitBid() {
      this.loadingIcon = true;
      let inputArgs = {
        id: this.adId,
        username: this.$store.state.loggedInUser,
        bidPrice: this.bidPrice,
        to: this.toPlace,
        from: this.fromPlace
      };
      placeBid(inputArgs)
        .then(res => {
          this.loadingIcon = false;
          this.successful = true;
        })
        .catch(err => err);
    }
  }
};
</script>
