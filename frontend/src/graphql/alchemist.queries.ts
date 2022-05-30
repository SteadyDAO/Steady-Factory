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

export const GET_ELIXIR_BY_TOKEN_ID = gql`
query GetElixirByTokenId($tokenId: String!) {
  elixirs (
    where: {
      id: $tokenId
    }
  ) {
    id
    tokenId
    ratio
    chyme {
      symbol
      steadyToken
      alchemist {
        id
      }
    }
  }
}
`;
