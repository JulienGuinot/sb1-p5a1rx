const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, AuthenticationError } = require('apollo-server-express');
const { OAuth2Client } = require('google-auth-library');
const Joi = require('joi');

const User = require('./models/User');
const Application = require('./models/Application');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./utils/email');
const { validateInput } = require('./utils/validation');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const resolvers = {
  Query: {
    me: async (_, __, { user, redisClient }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const cachedUser = await redisClient.get(`user:${user.id}`);
      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const fetchedUser = await User.findById(user.id);
      await redisClient.set(`user:${user.id}`, JSON.stringify(fetchedUser), 'EX', 3600); // Cache for 1 hour
      return fetchedUser;
    },
    getUserApplications: async (_, { page = 1, limit = 10 }, { user }) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      
      const skip = (page - 1) * limit;
      const applications = await Application.find({ userId: user.id })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

      const total = await Application.countDocuments({ userId: user.id });

      return {
        applications,
        pageInfo: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalItems: total,
        }
      };
    },
  },
  Mutation: {
    signUp: async (_, args, { redisClient, logger }) => {
      const { email, password, firstName, lastName, age } = args;

      // Validate input
      await validateInput(Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        age: Joi.string().required(),
      }), args);

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new UserInputError('Email already in use');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        age,
      });

      try {
        await user.save();
        await sendVerificationEmail(user.email, user.id);

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // Cache the new user
        await redisClient.set(`user:${user.id}`, JSON.stringify(user), 'EX', 3600);

        return { token, user };
      } catch (error) {
        logger.error('Error during sign up:', error);
        throw new Error('An error occurred during sign up');
      }
    },
    // ... (other mutations with similar improvements)
  },
};

module.exports = resolvers;