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
                    <v-btn @click="placeNewBid(item._id,item.to,item.from,item.owner)" class="orange" :loading="newBidLoadingIcon">Submit</v-btn>
                  </v-card>
                </v-dialog>
                <v-btn @click="showAllBids(item._id)" :loading="allBidsLoadingIcon">Show All Bids</v-btn>
                <v-dialog v-model="allBidsDialog" max-width="500">
                  <v-card class="pa-4 text-xs-center">
                    <p v-if="allBidsArr.length===0">No Bids Yet</p>
                    <p v-for="item in allBidsArr" :key="item.username">{{item.username}} - ${{item.bidPrice}}</p>
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
      const myQuery = gql`
        query($id: ID!) {
          allBidsForAd(adId: $id) {
            username
            bidPrice
          }
        }
      `;
      this.$apollo
        .query({
          query: myQuery,
          fetchPolicy: "network-only",
          variables: {
            id: adId
          }
        })
        .then(res => {
          this.allBidsArr = res.data.allBidsForAd;
          this.allBidsLoadingIcon = false;
          this.allBidsDialog = true;
        })
        .catch(err => err);
    },
    placeNewBid(id, to, from, username) {
      this.newBidLoadingIcon = true;
      let inputArgs = { id, username, to, from, bidPrice: this.bidPrice };
      const myMutation = gql`
        mutation($input: newBidArgs!) {
          placeNewBid(input: $input) {
            bidPrice
          }
        }
      `;
      this.$apollo
        .mutate({
          mutation: myMutation,
          variables: {
            input: inputArgs
          }
        })
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
      let skip = this.latestAds.length > 0 ? this.latestAds.length : 0;
      this.showMoreLoadingIcon = !status.refresh;
      const myQuery = gql`
        query($skip: Int!) {
          getAllAds(skip: $skip) {
            to
            from
            travelDate
            _id
            owner
          }
        }
      `;
      this.fetchAdsPartTwo(myQuery, skip);
    },
    fetchAdsPartTwo(query, skip) {
      let vm = this;
      this.$apollo
        .query({
          query,
          variables: { skip: skip },
          fetchPolicy: "network-only"
        })
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
