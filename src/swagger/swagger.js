const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Auth API",
      version: "1.0.0",
      description: "API documentation for authentication system",
    },
    servers: [{ url: "http://localhost:4000/api" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string", example: "64b2f3a..." },
            email: { type: "string", example: "user@example.com" },
            verified: { type: "boolean", example: false },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
          },
        },
        Tokens: {
          type: "object",
          properties: {
            accessToken: { type: "string", example: "eyJhbGciOi..." },
            refreshToken: { type: "string", example: "eyJhbGciOi..." },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: { type: "string", example: "Invalid credentials" },
            status: { type: "integer", example: 400 },
          },
        },
        RegisterRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        LoginRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: { type: "string", example: "user@example.com" },
            password: { type: "string", example: "StrongPass123" },
          },
        },
        RefreshRequest: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string", example: "eyJhbGciOi..." },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", example: "user@example.com" },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "password"],
          properties: {
            token: { type: "string", example: "reset-token-123" },
            password: { type: "string", example: "NewStrongPass123" },
          },
        },
      },
      tags: [
        { name: "Auth" },
        // { name: "User" },
        // { name: "Admin" },
        { name: "Posts" }
      ]

    },
  },
  apis: ["./src/routes/**/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };
