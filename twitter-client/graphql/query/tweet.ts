import { graphql } from "@/gql";

export const GetAllTweets = graphql(`
  #graphql
  query GetAllTweets {
    getAllTweets {
      content
      id
      imageURL
      author {
        id
        firstName
        lastName
        profileImageUrl
      }
    }
  }
`);

export const getMediaSignedURL = graphql(`
  #graphql
  query GetMediaRes($imageName: String!, $imageType: String!) {
    getSignedURLTweet(imageName: $imageName, imageType: $imageType)
  }
`);

export const getTweetID = graphql(`
  #graphql
  query GetTweetById($id: ID!) {
    getTweetById(id: $id) {
      id
      content
      imageURL
      author {
        id
        profileImageUrl
        firstName
        lastName
      }
    }
  }
`);
