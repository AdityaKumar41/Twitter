"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queries = void 0;
exports.queries = `#graphql
  verifyGoogleToken(token: String!): String
  getCurrectUser: User

  getUserById(id: ID!): User
`;
