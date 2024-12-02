import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.(js|jsx|mjs)$": "babel-jest", // Gunakan Babel untuk transformasi ESModules
  },
  moduleNameMapper: {
    // Mock file yang bukan JS
    "\\.(css|less|scss|sass)$": "identity-obj-proxy",
    // Mock module ESModule seperti next-auth
    "^@/components/(.*)$": "<rootDir>/components/$1",
    "^@/contexts/(.*)$": "<rootDir>/contexts/$1",
  },
  transformIgnorePatterns: [
    "node_modules/(?!next-auth|@smastrom/react-rating)", // Pastikan modul tertentu tidak diabaikan
  ],
  preset: "ts-jest/presets/js-with-ts-esm", // Gunakan preset ts-jest untuk ESModules
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config);
