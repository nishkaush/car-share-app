//apolloProvider is injected into Vue instance so that
//Its available in all vue child components as this.$apollo
//But we can achieve the same by importing apolloClient directly
//apolloClient = apolloProvider in technical terms

import gql from "graphql-tag";
import { apolloClient } from "./apollo";

function allBidsForAd(adId) {
  const myQuery = gql`
    query($id: ID!) {
      allBidsForAd(adId: $id) {
        username
        bidPrice
      }
    }
  `;
  return apolloClient.query({
    query: myQuery,
    fetchPolicy: "network-only",
    variables: {
      id: adId
    }
  });
}

function fetchAllAds(skip) {
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
  return apolloClient.query({
    query: myQuery,
    variables: { skip: skip },
    fetchPolicy: "network-only"
  });
}

function getSingleAd(adId) {
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
  return apolloClient.query({
    query: myQuery,
    variables: {
      id: adId
    }
  });
}

function allAdsForUser(username, adStatus) {
  const myQuery = gql`
    query($username: String!, $adStatus: String!) {
      allAdsForUser(username: $username, adStatus: $adStatus) {
        to
        from
        adId
        adStatus
        datePosted
      }
    }
  `;
  return apolloClient.query({
    query: myQuery,
    fetchPolicy: "network-only",
    variables: {
      username,
      adStatus
    }
  });
}
export { allBidsForAd, fetchAllAds, getSingleAd, allAdsForUser };
