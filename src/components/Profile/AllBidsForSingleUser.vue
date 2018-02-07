<template>
  <v-tabs-content id="bids-content">
    <div class="text-xs-right"> <v-btn @click="fetchBidsForSingleUser">Refresh Results</v-btn> </div>
    <v-data-table
        :items="items"
        class="elevation-1"
        hide-actions
        :headers="headers"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.from}}</td>
        <td>{{ props.item.to}}</td>
        <td>${{props.item.bidPrice}}</td>
        <td>{{props.item.bidStatus.toUpperCase() }}</td>
      </template>
    </v-data-table>
  </v-tabs-content>
</template>


<script>
import gql from "graphql-tag";
export default {
  data() {
    return {
      headers: [
        { text: "From", value: "from", align: "center", sortable: false },
        { text: "To", value: "to", align: "center", sortable: false },
        { text: "My Bid", value: "bidPrice", align: "center", sortable: false },
        {
          text: "Bid Status",
          value: "bidStatus",
          align: "center",
          sortable: false
        }
      ]
    };
  },
  methods: {
    fetchBidsForSingleUser() {
      let vm = this;
      const myQuery = gql`
        query($username: String!) {
          allBidsForUser(username: $username) {
            adId
            to
            from
            bidPrice
            bidStatus
          }
        }
      `;
      this.$apollo
        .query({
          query: myQuery,
          fetchPolicy: "network-only",
          variables: {
            username: vm.$store.state.loggedInUser
          }
        })
        .then(res => {
          console.log("all bids for this user are -->", res.data);
          vm.$store.commit("setAllBidsForSingleUser", {
            arr: res.data.allBidsForUser
          });
        });
    }
  },
  computed: {
    items() {
      return this.$store.state.allBidsForSingleUser;
    }
  },
  created() {
    this.fetchBidsForSingleUser();
    // let vm = this;
    // const myQuery = gql`
    //   query($username: String!) {
    //     allBidsForUser(username: $username) {
    //       adId
    //       to
    //       from
    //       bidPrice
    //       bidStatus
    //     }
    //   }
    // `;
    // this.$apollo
    //   .query({
    //     query: myQuery,
    //     variables: {
    //       username: vm.$store.state.loggedInUser
    //     },
    //     pollInterval: 3000
    //   })
    //   .then(res => {
    //     vm.$store.commit("setAllBidsForSingleUser", {
    //       arr: res.data.allBidsForUser
    //     });
    //   });
  }
};
</script>
