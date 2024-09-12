export const queries = `#graphql
  getAllTweets: [Tweet]

  getSignedURLTweet(imageName: String!,imageType:String!):String
  getTweetById(id: ID!): Tweet
`;
