const errorHandler = (error) => {
  // Log the error
  console.error('GraphQL Error:', error);

  // You can customize the error response here
  if (error.originalError instanceof UserInputError) {
    return {
      message: error.message,
      code: 'USER_INPUT_ERROR',
      status: 400,
    };
  }

  if (error.originalError instanceof AuthenticationError) {
    return {
      message: 'You must be logged in to access this resource',
      code: 'UNAUTHENTICATED',
      status: 401,
    };
  }

  // For all other errors, return a generic error message
  return {
    message: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    status: 500,
  };
};

module.exports = { errorHandler };