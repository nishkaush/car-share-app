<template>
    <v-layout row wrap>
      <!-- <my-search-bar></my-search-bar> -->
      <v-flex d-flex justify-content-center align-items-center v-if="showLoadingIcon===true">
        <v-progress-circular indeterminate :size="100" :width="7" color="orange">Getting Latest Listings</v-progress-circular>
      </v-flex>
      <v-flex xs12 md8 offset-md2 v-else>
        <div class="text-xs-right">
          <v-btn 
          class="mt-3 mb-0" 
          flat
          :loading="refreshLoadingIcon"
          @click="refreshAdResults"> 
          <v-icon x-large color="green">refresh</v-icon>
          Refresh Results
          </v-btn>
        </div>
        <p class="title">Latest Ads for Sharing Rides</p>
        <v-card v-if="latestAds.length===0" class="pt-2 pb-2">Fetching Latest Listings...</v-card>
        <v-card v-if="activeAds.length===0" class="pa-5">No Active Listings Found</v-card>
        <v-card v-for="item in latestAds" :key="item._id" v-if="item.adStatus==='onGoing'" class="mb-4">

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

                <all-bids-dialog :adId="item._id"></all-bids-dialog>
                <place-bid-dialogue :adId="item._id" :toPlace="item.to" :fromPlace="item.from"></place-bid-dialogue>

              </v-card-actions>
             </v-flex>
           </v-layout>

        </v-card>
        <div class="text-xs-center"><v-btn 
        @click="fetchAds" 
        :loading="showMoreLoadingIcon" 
        class="orange"
        :disabled="!showMoreBtn"
        >{{showMoreBtn?"Show More Results":"No more results left"}}</v-btn></div>
      </v-flex>
    </v-layout>
</template>

<script>
import { setIdToken } from "./../../utils/utils";
import gql from "graphql-tag";
import { allBidsForAd, fetchAllAds } from "./../../Apollo/queries";
import AllBidsDialog from "./AllBidsDialog.vue";
import PlaceBidDialog from "./PlaceBidDialog.vue";
import SearchBar from "./SearchBar.vue";
export default {
  data() {
    return {
      showLoadingIcon: false,
      refreshLoadingIcon: false,
      showMoreLoadingIcon: false,
      showMoreBtn: true,
      bidPrice: "",
      allBidsArr: []
    };
  },
  methods: {
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
    },
    activeAds() {
      let finalArr = this.latestAds.filter(e => e.adStatus === "onGoing");
      return finalArr;
    }
  },
  components: {
    "place-bid-dialogue": PlaceBidDialog,
    "all-bids-dialog": AllBidsDialog,
    "my-search-bar": SearchBar
  },
  created() {
    if (this.latestAds.length === 0) {
      this.fetchAds();
    } else {
      this.refreshAdResults();
    }
  }
};
</script>
