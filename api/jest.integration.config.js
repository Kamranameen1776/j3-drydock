const config = require('./jest.config');
module.exports = {
    ...config,
    displayName: 'api:integration',
    testRegex: ['api-tests/.*\\.spec\\.ts$'],
    setupFilesAfterEnv: ['<rootDir>/src/jest.integration.setup.ts'],
    testPathIgnorePatterns: ['/build/', '/node_modules/'],
};
