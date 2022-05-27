import { gql } from "@apollo/client";

export const GET_ALCHEMISTS = gql`
  query GetAlchemists {
    alchemists {
      id
      count
      alchemist
      chyme {
        id
        symbol
        priceOracle
        steadyToken
      }
    }
  }
`;
