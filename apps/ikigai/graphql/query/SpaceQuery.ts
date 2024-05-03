import { gql } from "@apollo/client";

export const GET_SPACE_INFORMATION = gql`
  query GetDocuments($spaceId: Int!) {
    spaceGet(spaceId: $spaceId) {
      id
      name
      documents {
        id
        title
        createdAt
        parentId
        index
        documentType
        deletedAt
        assignment {
          id
        }
        submission {
          id
        }
      }
    }
  }
`;

export const GET_SPACE_MEMBERS = gql`
  query GetSpaceMembers($spaceId: Int!) {
    spaceGet(spaceId: $spaceId) {
      id
      members {
        userId
        spaceId
        createdAt
        role
        user {
          id
          firstName
          lastName
          email
          randomColor
          name
          avatar {
            publicUrl
          }
        }
      }
    }
  }
`;

export const GET_SPACE_INVITE_TOKENS = gql`
  query GetSpaceInviteTokens($spaceId: Int!) {
    spaceGetInviteTokens(spaceId: $spaceId) {
      spaceId
      creator {
        id
        firstName
        lastName
        email
        avatar {
          publicUrl
        }
        randomColor
      }
      token
      invitingRole
      uses
      expireAt
      createdAt
    }
  }
`;
