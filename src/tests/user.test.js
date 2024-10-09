const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');
const { createTestClient } = require('apollo-server-testing');
const typeDefs = require('../schema');
const resolvers = require('../resolvers');
const User = require('../models/User');

const testServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ user: null })
});

const { query, mutate } = createTestClient(testServer);

beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Resolvers', () => {
  it('should create a new user', async () => {
    const CREATE_USER = `
      mutation {
        signUp(email: "test@example.com", password: "password123", firstName: "Test", lastName: "User", age: "25") {
          user {
            id
            email
            firstName
            lastName
          }
        }
      }
    `;

    const res = await mutate({ mutation: CREATE_USER });
    expect(res.data.signUp.user).toHaveProperty('id');
    expect(res.data.signUp.user.email).toBe('test@example.com');
  });

  // Add more tests for other resolvers
});