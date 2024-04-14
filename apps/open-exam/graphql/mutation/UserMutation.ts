import { gql } from "@apollo/client";

export const SEND_MAGIC_LINK = gql`
  mutation SendMagicLink($email: String!) {
    userGenerateMagicLink(email: $email)
  }
`;

export const VERIFY_MAGIC_LINK = gql`
  mutation VerifyMagicLink($userId: Int!, $otp: String!) {
    userCheckMagicLink(userId: $userId, otp: $otp) {
      user {
        id
      }
      accessToken
    }
  }
`;
