<template>
<v-layout row class="mt-5">
  <v-snackbar v-model="mySnackbar" :top="mySnackbarPosition" :timeout="mySnackbarTimeout">
    {{mySnackbarText}}
    <v-btn class="orange" @click="mySnackbar=false">Close</v-btn>
  </v-snackbar>
  <v-flex xs12 md6 offset-md3>

    <v-data-table
        :items="adInfoTable"
        class="elevation-1"
        hide-actions
        hide-headers
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.text.toUpperCase() }}</td>
        <v-spacer></v-spacer>
        <td>{{ currentAd[props.item.prop]|| "Not Provided"}}</td>
      </template>
      <template slot="no-data">
        <v-progress-circular indeterminate :size="70" :width="7" color="orange"></v-progress-circular>
      </template>
    </v-data-table>

    <div class="text-xs-center">
      <v-btn class="orange" @click="seeAllBids" :loading="allBidsLoading" :disabled="disableBtn">Show All Bids</v-btn>
      <v-dialog v-model="seeBidsDialog" max-width="500">
        <v-card class="pa-4 text-xs-center">
          <h2 class="text-xs-center">List of Current Bids</h2>
          <hr>
          <p v-if="allBidsArray.length===0">No Bids Yet</p>
          <p class="mt-3" v-for="(item,i) in allBidsArray" :key="i">{{item.username}} - ${{item.bidPrice}}</p>
        </v-card>
      </v-dialog>

      <v-btn class="orange" @click="loginState?placeBidBox=true:mySnackbar=true" :disabled="disableBtn">Place a bid</v-btn>
      <v-dialog v-model="placeBidBox" max-width="500">
        <v-card class="pa-5">
          <v-text-field label="Enter Bid in $" v-model="bidAmount" mask="####"></v-text-field>
          <v-btn @click="postNewBid" class="orange" :loading="newBidLoading">Submit</v-btn>
        </v-card>
      </v-dialog>
    </div>

  </v-flex>
</v-layout>
</template>

<script>
import gql from "graphql-tag";
import { getSingleAd, allBidsForAd } from "./../../Apollo/queries";
import { placeBid } from "./../../Apollo/mutations";
export default {
  data() {
    return {
      // initialLoadIcon: true,
      allBidsLoading: false,
      newBidLoading: false,
      seeBidsDialog: false,
      allBidsArray: [],
      placeBidBox: false,
      bidAmount: "",
      mySnackbar: false,
      mySnackbarPosition: "top",
      mySnackbarTimeout: 6000,
      mySnackbarText: "Please login or signup to place bids",
      adInfoTable: [
        { text: "From", prop: "from" },
        { text: "To", prop: "to" },
        { text: "Travel Date", prop: "travelDate" },
        { text: "Posted By", prop: "owner" },
        { text: "Passengers Allowed", prop: "passengers" },
        { text: "Additional Info", prop: "additionalNote" },
        { text: "Ad Status", prop: "adStatus" }
      ]
    };
  },
  methods: {
    fetchSingleAd() {
      let vm = this;
      let adId = this.currentRoute;
      getSingleAd(adId)
        .then(res => {
          this.$store.dispatch("changeSingleAd", { ad: res.data.getSingleAd });
          // this.initialLoadIcon = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    seeAllBids() {
      let vm = this;
      this.allBidsLoading = true;
      let adId = this.currentRoute;
      allBidsForAd(adId)
        .then(res => {
          vm.allBidsLoading = false;
          vm.allBidsArray = res.data.allBidsForAd;
          vm.seeBidsDialog = true;
        })
        .catch(err => err);
    },
    postNewBid() {
      let vm = this;
      this.newBidLoading = true;
      let inputArgs = {
        to: this.currentAd.to,
        from: this.currentAd.from,
        username: this.$store.state.loggedInUser,
        id: this.currentAd._id,
        bidPrice: this.bidAmount
      };
      placeBid(inputArgs)
        .then(res => {
          vm.newBidLoading = false;
          vm.placeBidBox = false;
          vm.mySnackbar = true;
          vm.mySnackbarText = "Your Bid Has Been Posted Successfully!";
          setTimeout(
            () => (vm.mySnackbarText = "Login or signup to place bids"),
            6000
          );
        })
        .catch(err => err);
    }
  },
  computed: {
    disableBtn() {
      return this.currentAd.adStatus === "onGoing" ? false : true;
    },
    currentAd() {
      return this.$store.state.currentSingleAd;
    },
    currentRoute() {
      return this.$route.params.adId;
    },
    loginState() {
      return this.$store.state.loggedIn;
    }
  },
  created() {
    this.fetchSingleAd();
  }
};
</script>
