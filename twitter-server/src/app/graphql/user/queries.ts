export const queries = `#graphql
  verifyGoogleToken(token: String!): String
  getCurrectUser: User

  getUserById(id: ID!): User
`;
