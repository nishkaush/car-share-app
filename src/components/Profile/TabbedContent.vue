<template>
  <v-tabs fixed centered>
    <v-tabs-bar>
      <v-tabs-slider color="orange"></v-tabs-slider>
      <v-tabs-item href="#ads-content">My Ads</v-tabs-item>
      <v-tabs-item href="#bids-content">My Bids</v-tabs-item>
    </v-tabs-bar>
    <v-tabs-items class="mt-4">

      <v-tabs-content id="ads-content">
        <v-list>
          <p v-if="myAdsArr.length===0">You haven't posted any ads yet!</p>
          <template v-for="(item,i) in myAdsArr">
            <v-list-tile :key="item.id" class="pa-3">
              <v-list-tile-content>
                <v-list-tile-title>From {{item.from}} To {{item.to}}</v-list-tile-title>
                <v-list-tile-sub-title>Date Posted - {{item.datePosted}}</v-list-tile-sub-title>
              </v-list-tile-content>
              <v-list-tile-action>
                <v-btn @click="adsBidDialog=true">Show All Bids</v-btn>
                <v-dialog v-model="adsBidDialog" max-width="500">
                  <v-card class="pa-4 text-xs-center">

                    <v-radio-group v-model="chosenBid">
                      <v-radio 
                      v-for="(item,i) in adsBidsArr" 
                      :key="i" 
                      :label="`${item.username} - $${item.bidPrice}`" 
                      value="haha"></v-radio>
                    </v-radio-group>

                    <!-- <div v-for="(item,i) in adsBidsArr" :key="i">
                      <p>{{item.username}} - {{item.bidPrice}}</p>
                      <v-btn>Approve</v-btn>
                    </div> -->
                  </v-card>
                </v-dialog>
              </v-list-tile-action>
            </v-list-tile>
            <v-divider :key="i"></v-divider>
          </template>
        </v-list>
      </v-tabs-content>

      <v-tabs-content id="bids-content">
        Lorem ipsum dolor sit amet consect
      </v-tabs-content>

    </v-tabs-items>
  </v-tabs>
</template>

<script>
export default {
  data() {
    return {
      adsBidDialog: false,
      chosenBid: "",
      adsBidsArr: [
        { username: "nish@nish.com", bidPrice: "70" },
        { username: "sana@sana.com", bidPrice: "80" }
      ],
      myAdsArr: [
        {
          to: "germany",
          from: "france",
          id: "34534fadsffdsafsd",
          datePosted: "3-3-2001"
        },
        {
          to: "sydney",
          from: "melbourne",
          id: "asdfasdf234",
          datePosted: "5-5-2005"
        },
        {
          to: "delhi",
          from: "haridwar",
          id: "asdfsa445dfg3",
          datePosted: "6-4-2001"
        },
        {
          to: "beijing",
          from: "shanghai",
          id: "asdfs24sdfg4543",
          datePosted: "3-5-2008"
        }
      ]
    };
  }
};
</script>

