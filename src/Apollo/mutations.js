import gql from "graphql-tag";
import { apolloClient } from "./apollo";

function placeBid(inputArgs) {
  const myMutation = gql`
    mutation($input: newBidArgs!) {
      placeNewBid(input: $input) {
        bidPrice
      }
    }
  `;
  return apolloClient.mutate({
    mutation: myMutation,
    variables: {
      input: inputArgs
    }
  });
}

function postNewAd(formData) {
  const myMutation = gql`
    mutation($input: formData!) {
      createNewAd(input: $input) {
        _id
        to
        from
        travelDate
      }
    }
  `;
  return apolloClient.mutate({
    mutation: myMutation,
    fetchPolicy: "network-only",
    variables: {
      input: formData
    }
  });
}

function approvingBid(adId, owner, winnerName) {
  const myMutation = gql`
    mutation($adId: ID!, $owner: String!, $winnerName: String!) {
      approveBid(adId: $adId, owner: $owner, winnerName: $winnerName) {
        adId
        datePosted
        adStatus
        to
        from
      }
    }
  `;
  return apolloClient.mutate({
    mutation: myMutation,
    variables: {
      adId,
      owner,
      winnerName
    }
  });
}

export { placeBid, postNewAd, approvingBid };
