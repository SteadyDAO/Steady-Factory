import { gql } from "@apollo/client";

export const GET_PLATFORMS = gql`
  query GetPlatforms {
    platforms {
      id
      totalValueLocked
      totalSplit
      totalMerged
    }
  }
`;

export const GET_RECENT_ACTIVITY = gql`
  query GetRecentActivity {
    elixirs (
      first: 5,
      orderBy: dateSplit,
      orderDirection: desc
    ) {
      id
      status
      amount
      dateSplit
      dateMerged
      splitTxId
      mergeTxId
      owner
      chyme {
        id
        symbol
      }
    }
  }
`;

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
