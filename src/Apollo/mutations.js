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

export { placeBid };
