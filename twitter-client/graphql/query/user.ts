import { graphql } from "../../gql";
export const VerifyGoogleAuthToken = graphql(`
  #graphql
  query verifyGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const GetCurrectLoginUserQuery = graphql(
  `
    #graphql
    query getCurrectLoginQuery {
      getCurrectUser {
        id
        firstName
        lastName
        email
        profileImageUrl
      }
    }
  `
);
