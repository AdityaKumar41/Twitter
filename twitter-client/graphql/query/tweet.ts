import { graphql } from "@/gql";

export const GetAllTweets = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      content
      id
      imageURL
      author {
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`);
