import { gql } from '@apollo/client';


export const GET_USER_STATS = gql`
  query GetUserStats {
    me {
      stats {
        wins
        losses
        draws
      }
      gameHistory {
        _id
        result
        createdAt
      }
    }
  }
`;

export const QUERY_PROFILES = gql`
  query allProfiles {
    profiles {
      _id
      name
      skills
    }
  }
`;

export const QUERY_SINGLE_PROFILE = gql`
  query singleProfile($profileId: ID!) {
    profile(profileId: $profileId) {
      _id
      name
      skills
    }
  }
`;

export const QUERY_ME = gql`
  query me {
    me {
      _id
      name
      skills
    }
  }
`;
