module.exports = {
    displayName: 'api:unit',
    testEnvironment: 'node',
    roots: ['<rootDir>/src'],
    transform: {
        '^.+\\.ts?$': 'ts-jest',
    },
    testRegex: ['(/__tests__/.*)(.)(test|spec).ts'],
    testPathIgnorePatterns: ['/build/', '/node_modules/', '/api-tests/'],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    verbose: false,
    collectCoverage: true,
    collectCoverageFrom: ['**/*.ts', '!**/node_modules/**']
};
