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

export const GET_ELIXIR_BY_ACCOUNT = gql`
  query GetElixirByAccount($account: String!, $chymeIds: [String]!) {
    elixirs (
      where: {
        owner: $account,
        status: Split,
        chyme_in: $chymeIds
      },
      orderBy: dateSplit,
      orderDirection: desc,
    ) {
      id
      tokenId
      status
      ratioOfSteady
      forgeConstant
      amount
      dateSplit
      dateMerged
      chyme {
        id
        symbol
        priceOracle
        steadyToken
        alchemist {
          id
        }
      }
      vault
      owner
    }
  }
`;
