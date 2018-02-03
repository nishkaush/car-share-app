<template>
    <v-layout row>
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
                <v-btn>More Info</v-btn>
                <v-btn>Place a bid</v-btn>
                <v-btn>Show All Bids</v-btn>
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
      showMoreBtn: true
    };
  },
  methods: {
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
