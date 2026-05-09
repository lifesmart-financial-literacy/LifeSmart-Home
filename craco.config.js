const path = require('path');

module.exports = {
  webpack: {
    // Never alias `firebase` → node_modules: CRA ModuleScopePlugin rejects resolved paths outside src/.
    alias: {
      '@': path.resolve(__dirname, 'src'),
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
