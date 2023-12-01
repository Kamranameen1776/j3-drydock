module.exports = {
    root: true,
    env: {
        node: true,
        jest: true,
    },
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname,
        sourceType: 'module',
    },
    plugins: ['simple-import-sort', '@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended', 'plugin:prettier/recommended'],
    ignorePatterns: ['.eslintrc.js', 'jest.config.js', 'jest.integration.config.js','src/migration/**/*'],
    rules: {
        'no-return-await': 'error',
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    accessors: 'explicit',
                    constructors: 'no-public',
                    methods: 'explicit',
                    properties: 'off',
                    parameterProperties: 'explicit',
                },
            },
        ],
        'no-empty-function': 'off',
        "@typescript-eslint/naming-convention": [
            "error",
            {
                selector: ['class'],
                format: ['StrictPascalCase'],
            },
            {
                selector: ['classProperty'],
                format: ['camelCase', 'StrictPascalCase']
            }
        ],
    },
};
