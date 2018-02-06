<template>
  <div>
      <v-btn @click="showAllBids" :loading="btnLoadingIcon">Show All Bids</v-btn>
      <v-dialog v-model="dialogBox" max-width="500">
        <v-card class="pa-4">
          <h2>List of Current Bids</h2>
          <v-divider></v-divider>
          <p v-if="bidsArr.length===0">No Bids Yet</p>
          <v-card-text>
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
          <v-card-actions>
            <v-btn class="orange" :disabled="!chosenBid" @click="approveBid">Approve</v-btn>
            <!-- This button should have a click event for approving a bid -->
          </v-card-actions>
        </v-card>
      </v-dialog>
  </div>

</template>

<script>
import { allBidsForAd } from "./../../Apollo/queries";
export default {
  props: ["myAdId"],
  data() {
    return {
      chosenBid: "",
      btnLoadingIcon: false,
      dialogBox: false
    };
  },
  methods: {
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
      //We send the username from the approved bid
      //change the ad Status to finished
      //
    }
  },
  computed: {
    bidsArr() {
      return this.$store.state.bidsForAdArr;
    }
  }
};
</script>
