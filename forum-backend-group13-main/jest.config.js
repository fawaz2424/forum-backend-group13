module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  collectCoverage: true,
  collectCoverageFrom: [
    "src/application/controllers/AuthController.ts",
    "src/application/use-cases/RegisterUser.ts",
    "src/application/use-cases/LoginUser.ts",
    "src/presentation/middleware/authMiddleware.ts"
  ],
};