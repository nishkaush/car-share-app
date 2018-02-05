<template>
    <v-layout row>
      <v-snackbar v-model="snackbar" :top="snackBarPosition" :timeout="snackBarTimeout">
       {{snackBarText}}
        <v-btn class="orange" @click="snackbar=false">Close</v-btn>
      </v-snackbar>
      <v-flex d-flex justify-content-center align-items-center v-if="showLoadingIcon===true">
        <v-progress-circular indeterminate :size="100" :width="7" color="orange">Getting Latest Listings</v-progress-circular>
      </v-flex>
      <v-flex xs12 md8 offset-md2 v-else>
        <div class="text-xs-right">
          <v-btn 
          class="mb-5 mt-3" 
          :loading="refreshLoadingIcon"
          @click="refreshAdResults"> 
          <v-icon>refresh</v-icon> 
          &nbsp; Refresh Results
          </v-btn>
        </div>
        <p class="title">Latest Ads for Sharing Car Rides</p>
        <v-card v-if="latestAds.length===0" class="pt-2 pb-2">Fetching Latest Listings...</v-card>
        <v-card v-for="(item,i) in latestAds" :key="i" v-if="latestAds.length>0" class="mb-4">

           <v-layout row wrap>
             <v-flex xs12 lg7>
              <v-card-title>
                <h3>From {{item.from.toUpperCase()}} To {{item.to.toUpperCase()}}</h3>
              </v-card-title>
              <v-card-text>
                <span class="sub-title">Travel Date {{item.travelDate}}</span>
              </v-card-text>
             </v-flex>
             <v-flex xs12 lg5>
              <v-card-actions>
                <v-btn @click="showSingleAd(item._id)">More Info</v-btn>
                <v-btn @click="loginStatus?placeBidDialog=true:snackbar=true">Place a bid</v-btn>
                <v-dialog v-model="placeBidDialog" max-width="500">
                  <v-card class="pa-5">
                    <v-text-field label="Enter Bid in $" v-model="bidPrice" mask="####"></v-text-field>
                    <v-btn @click="placeNewBid(item._id,item.to,item.from)" class="orange" :loading="newBidLoadingIcon">Submit</v-btn>
                  </v-card>
                </v-dialog>
                <v-btn @click="showAllBids(item._id)" :loading="allBidsLoadingIcon">Show All Bids</v-btn>
                <v-dialog v-model="allBidsDialog" max-width="500">
                  <v-card class="pa-4 text-xs-center">
                    <h2 class="text-xs-center">List of Current Bids</h2>
                    <hr>
                    <p v-if="allBidsArr.length===0">No Bids Yet</p>
                    <p class="mt-3" v-for="(item,i) in allBidsArr" :key="i">{{item.username}} - ${{item.bidPrice}}</p>
                  </v-card>
                </v-dialog>
              </v-card-actions>
             </v-flex>
           </v-layout>

        </v-card>
        <v-btn 
        block @click="fetchAds" 
        :loading="showMoreLoadingIcon" 
        class="orange"
        :disabled="!showMoreBtn"
        >{{showMoreBtn?"Show More Results":"No more results left"}}</v-btn>
      </v-flex>
    </v-layout>
</template>

<script>
import { setIdToken } from "./../../utils/utils";
import gql from "graphql-tag";
import { allBidsForAd, fetchAllAds } from "./../../Apollo/queries";
import { placeBid } from "./../../Apollo/mutations";
export default {
  data() {
    return {
      showLoadingIcon: false,
      refreshLoadingIcon: false,
      showMoreLoadingIcon: false,
      newBidLoadingIcon: false,
      allBidsLoadingIcon: false,
      showMoreBtn: true,
      placeBidDialog: false,
      allBidsDialog: false,
      bidPrice: "",
      allBidsArr: [],
      snackbar: false,
      snackBarPosition: "top",
      snackBarTimeout: 6000,
      snackBarText: "Please login to place bids"
    };
  },
  methods: {
    showAllBids(adId) {
      this.allBidsLoadingIcon = true;
      allBidsForAd(adId)
        .then(res => {
          this.allBidsArr = res.data.allBidsForAd;
          this.allBidsLoadingIcon = false;
          this.allBidsDialog = true;
        })
        .catch(err => err);
    },
    placeNewBid(id, to, from) {
      this.newBidLoadingIcon = true;
      let username = this.$store.state.loggedInUser;
      let inputArgs = { id, username, to, from, bidPrice: this.bidPrice };
      console.log("Ad's id is -->", inputArgs.id);
      placeBid(inputArgs)
        .then(res => {
          this.newBidLoadingIcon = false;
          this.placeBidDialog = false;
          this.snackbar = true;
          this.snackBarText = "Your Bid Was Successfully Posted!";
          setTimeout(
            () => (this.snackBarText = "Please login to place bids"),
            6000
          );
        })
        .catch(err => !this.newBidLoadingIcon);
    },
    showSingleAd(adId) {
      this.$router.push({ path: `/ad/${adId}` });
    },
    refreshAdResults() {
      this.refreshLoadingIcon = true;
      this.showMoreBtn = true;
      this.$store.commit("emptyAdsArr");
      this.fetchAds({ refresh: true });
    },
    fetchAds(status = { refresh: false }) {
      let vm = this;
      let skip = this.latestAds.length > 0 ? this.latestAds.length : 0;
      this.showMoreLoadingIcon = !status.refresh;
      fetchAllAds(skip)
        .then(res => {
          vm.showLoadingIcon = false;
          vm.refreshLoadingIcon = false;
          vm.showMoreLoadingIcon = false;
          res.data.getAllAds.length > 0
            ? vm.$store.dispatch("changeAdsArr", { arr: res.data.getAllAds })
            : (vm.showMoreBtn = false);
        })
        .catch(err => {
          vm.showLoadingIcon = false;
          vm.refreshLoadingIcon = false;
          vm.showMoreLoadingIcon = false;
        });
    }
  },
  computed: {
    latestAds() {
      return this.$store.state.adsArr;
    },
    loginStatus() {
      return this.$store.state.loggedIn;
    },
    evaluatedKey() {
      return this.$store.state.LastEvaluatedKey;
    }
  },
  created() {
    if (this.latestAds.length === 0) {
      this.fetchAds();
    }
  }
};
</script>
