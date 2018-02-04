<template>
<v-layout row class="mt-5">
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
    </v-data-table>
    <div class="text-xs-center">
      <v-btn class="orange">Show Current Bids</v-btn>
      <v-btn class="orange">Place a bid</v-btn>
    </div>

  </v-flex>
</v-layout>
</template>

<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      currentRoute: this.$route.params.adId,
      adInfoTable: [
        { text: "From", prop: "from" },
        { text: "To", prop: "to" },
        { text: "Travel Date", prop: "travelDate" },
        { text: "Posted By", prop: "owner" },
        { text: "Passengers Allowed", prop: "passengers" },
        { text: "Additional Info", prop: "additionalNote" }
      ]
    };
  },
  methods: {
    fetchSingleAd() {
      let vm = this;
      const myQuery = gql`
        query($id: ID!) {
          getSingleAd(id: $id) {
            _id
            to
            from
            owner
            travelDate
            datePosted
            passengers
            additionalNote
          }
        }
      `;
      this.$apollo
        .query({
          query: myQuery,
          variables: {
            id: vm.currentRoute
          }
        })
        .then(res => {
          this.$store.dispatch("changeSingleAd", { ad: res.data.getSingleAd });
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  computed: {
    currentAd() {
      return this.$store.state.currentSingleAd;
    }
  },
  created() {
    let vm = this;
    if (!this.currentAd) {
      this.fetchSingleAd();
    }
  }
};
</script>
