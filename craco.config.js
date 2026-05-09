const path = require('path');

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Single firebase package instance avoids "Service firestore is not available" from duplicate registries
      firebase: path.resolve(__dirname, 'node_modules/firebase'),
    },
  },
  jest: {
    configure: {
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
      },
    },
  },
};
