<template>
  <div>
    <v-btn @click="fetchAllBids" :loading="loadingIcon">Show All Bids</v-btn>
    <v-dialog v-model="showAllBidsDialog" max-width="500">
      <v-card class="pa-4">
        <v-card-title>
          <h2>List of Current Bids</h2>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <p v-if="bidsArr.length===0">No Bids Yet</p>
          <p v-for="(item,i) in bidsArr" :key="i">{{item.username}} - ${{item.bidPrice}}</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>


<script>
import { allBidsForAd } from "./../../Apollo/queries";
export default {
  props: ["adId"],
  data() {
    return {
      showAllBidsDialog: false,
      loadingIcon: false
    };
  },
  methods: {
    fetchAllBids() {
      this.loadingIcon = true;
      this.showAllBidsDialog = true;
      let adId = this.adId;
      allBidsForAd(adId)
        .then(res => {
          this.loadingIcon = false;
          this.$store.commit("updateBidsForSingleAd", {
            arr: res.data.allBidsForAd
          });
        })
        .catch(err => err);
    }
  },
  computed: {
    bidsArr() {
      return this.$store.state.bidsForSingleAd;
    }
  }
};
</script>
