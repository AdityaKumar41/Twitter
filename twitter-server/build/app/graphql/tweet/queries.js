"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
  getAllTweets: [Tweet]

  getSignedURLTweet(imageName: String!,imageType:String!):String
  getTweetById(id: ID!): Tweet
`;
