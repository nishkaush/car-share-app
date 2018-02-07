<template>
  <v-tabs fixed centered>
    <v-tabs-bar>
      <v-tabs-slider color="orange"></v-tabs-slider>
      <v-tabs-item href="#ads-content">My Ads</v-tabs-item>
      <v-tabs-item href="#bids-content">My Bids</v-tabs-item>
    </v-tabs-bar>
    <v-tabs-items class="mt-4">
      <v-tabs-content id="ads-content">
        <v-select
          :items="adStatuses"
          v-model="adStatusType"
          label="Select Status"
          single-line
          bottom
        ></v-select>
        <v-list>
          <p v-if="myAdsArr.length===0">No Ads to Display</p>
          <v-list-tile v-for="(item,i) in myAdsArr" :key="i" class="pa-3">
            <v-list-tile-content>
              <v-list-tile-title>From {{item.from.toUpperCase()}} To {{item.to.toUpperCase()}}</v-list-tile-title>
              <v-list-tile-sub-title>Posted On {{item.datePosted}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <my-ads-dialog :myAdId="item.adId" :adStatus="item.adStatus"></my-ads-dialog>
            </v-list-tile-action>
          </v-list-tile>
        </v-list>
      </v-tabs-content>

      <bids-content id="bids-content"></bids-content>

    </v-tabs-items>
  </v-tabs>
</template>

<script>
import gql from "graphql-tag";
import AdsDialog from "./AdsDialog.vue";
import { allAdsForUser } from "./../../Apollo/queries";
import AllBidsForSingleUser from "./AllBidsForSingleUser.vue";

export default {
  data() {
    return {
      adStatusType: "onGoing",
      chosenBid: "",
      adStatuses: ["onGoing", "finished"]
    };
  },
  computed: {
    myAdsArr() {
      return this.$store.state.userAdsArr || [];
    }
  },
  components: {
    "my-ads-dialog": AdsDialog,
    "bids-content": AllBidsForSingleUser
  },
  created() {
    let username = this.$store.state.loggedInUser;
    let adStatus = this.adStatusType;
    allAdsForUser(username, adStatus)
      .then(res => {
        this.$store.dispatch("changeUserAdsArr", {
          userAds: res.data.allAdsForUser
        });
      })
      .catch(err => err);
  },
  watch: {
    adStatusType(val) {
      let username = this.$store.state.loggedInUser;
      allAdsForUser(username, val)
        .then(res => {
          this.$store.dispatch("changeUserAdsArr", {
            userAds: res.data.allAdsForUser
          });
        })
        .catch(err => err);
    }
  }
};
</script>
