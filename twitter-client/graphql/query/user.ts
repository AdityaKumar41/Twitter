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
        createdAt
      }
    }
  `
);

export const GetUserByIdQuery = graphql(
  `
    #graphql
    query GetUserById($id: ID!) {
      getUserById(id: $id) {
        id
        email
        firstName
        lastName
        profileImageUrl
        tweets {
          id
          content
          imageURL
          author {
            id
            firstName
            lastName
            profileImageUrl
          }
        }
      }
    }
  `
);
