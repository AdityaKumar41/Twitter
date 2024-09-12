export const type = `#graphql

  type User {
  id: ID!
  firstName: String!
  lastName: String
  email: String!
  profileImageUrl: String
  createdAt: String

  tweets: [Tweet]
  }  
`;
