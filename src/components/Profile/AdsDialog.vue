<template>
  <div>
    <v-btn @click="showAllBids" :loading="btnLoadingIcon" :disabled="adStatus==='finished'">Show All Bids</v-btn>
    <v-dialog v-model="dialogBox" max-width="500" persistent>
      <v-card class="pa-4">

        <h2>List of Current Bids</h2>
        <v-divider></v-divider>
        <p v-if="bidsArr.length===0">No Bids Yet</p>
        <v-card-text v-if="successful">
          <div class="text-xs-center pb-3"><v-icon dark x-large color="green">check_circle</v-icon></div>
          <h3>You have successfully chosen a winning Bid!</h3>
          <p>The winner has been notified and your listing has finished.</p>
          <div><v-btn class="orange mt-3" @click="closeDialogBox">Close</v-btn></div>
        </v-card-text>
        <v-card-text v-else>
          <v-radio-group v-model="chosenBid" :mandatory="false">
            <v-radio 
            color="orange"
            v-for="(item,i) in bidsArr" 
            :key="i" 
            :label="`${item.username} - $${item.bidPrice}`" 
            :value="`${item.username}`"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions v-if="successful===false">
          <v-btn class="orange" :disabled="!chosenBid" @click="approveBid" :loading="loadingIcon">Approve</v-btn>
          <v-btn class="orange" @click="closeDialogBox">Close</v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>
  </div>

</template>

<script>
import gql from "graphql-tag";
import { allBidsForAd } from "./../../Apollo/queries";
import { approvingBid } from "./../../Apollo/mutations";
export default {
  props: ["myAdId", "adStatus"],
  data() {
    return {
      chosenBid: "",
      btnLoadingIcon: false,
      loadingIcon: false,
      dialogBox: false,
      successful: false,
      snackbar: false,
      timeout: 6000,
      top: "top"
    };
  },
  methods: {
    closeDialogBox() {
      this.dialogBox = false;
      this.successful = false;
    },
    showAllBids() {
      this.btnLoadingIcon = true;
      let adId = this.myAdId;
      allBidsForAd(adId)
        .then(res => {
          this.btnLoadingIcon = false;
          this.dialogBox = true;
          this.$store.commit("updateBidsForAdArr", {
            arr: res.data.allBidsForAd
          });
        })
        .catch(err => (this.btnLoadingIcon = false));
    },
    approveBid() {
      let vm = this;
      this.loadingIcon = true;
      let adId = this.myAdId;
      let owner = this.$store.state.loggedInUser;
      let winnerName = this.chosenBid;
      approvingBid(adId, owner, winnerName)
        .then(res => {
          vm.loadingIcon = false;
          vm.successful = true;
          setTimeout(
            () =>
              vm.$store.commit("updateUserAdsArr", {
                arr: res.data.approveBid
              }),
            4000
          );
        })
        .catch(err => {
          vm.loadingIcon = false;
          vm.dialogBox = false;
          return err;
        });
    }
  },
  computed: {
    bidsArr() {
      return this.$store.state.bidsForAdArr;
    }
  }
};
</script>
