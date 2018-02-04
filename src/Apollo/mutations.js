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

export { placeBid, postNewAd };
