"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.type = void 0;
exports.type = `#graphql

  input CreateTweetData{
    content: String!
    imageURL: String
  }

  type Tweet{
    id: ID!
    content: String!
    imageURL: String
    author: User
  }
`;
