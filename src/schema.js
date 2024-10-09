const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    firstName: String!
    lastName: String!
    email: String!
    createdAt: String!
    emailVerified: Boolean!
  }

  type Application {
    id: ID!
    company: String!
    position: String!
    status: String!
    date: String!
    location: String!
    userId: ID!
    createdAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    getUserApplications: [Application!]!
  }

  type Mutation {
    signUp(email: String!, password: String!, firstName: String!, lastName: String!, age: String!): AuthPayload!
    signIn(email: String!, password: String!): AuthPayload!
    loginWithGoogle(idToken: String!): AuthPayload!
    sendVerificationEmail: Boolean!
    resetPassword(email: String!): Boolean!
    updateUserEmail(newEmail: String!): Boolean!
    createApplication(company: String!, position: String!, status: String!, date: String!, location: String!): Application!
    updateApplicationStatus(id: ID!, status: String!): Application!
    deleteApplication(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;