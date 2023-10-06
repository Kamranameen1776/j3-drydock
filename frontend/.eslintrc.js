module.exports = {
  root: true,
  ignorePatterns: [],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        createDefaultProgram: true
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'plugin:prettier/recommended'
      ],
      rules: {
        'consistent-return': 'warn',
        'consistent-this': 'off',
        curly: 'error',
        'default-case': 'error',
        'default-case-last': 'error',
        'default-param-last': 'error',
        'dot-notation': 'error',
        eqeqeq: ['error', 'always', { null: 'ignore' }],
        'grouped-accessor-pairs': 'error',
        'max-depth': 'error',
        'max-lines': 'error',
        'no-alert': 'error',
        'no-array-constructor': 'error',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-confusing-arrow': 'error',
        'no-console': 'error',
        'no-else-return': 'error',
        'no-empty-function': ['error', { allow: ['constructors'] }],
        'no-var': 'error',
        'max-lines': ['error', 1000],

        /* @angular-eslint/eslint-plugin */
        '@angular-eslint/component-selector': [
          'error',
          {
            prefix: 'jb',
            style: 'kebab-case',
            type: 'element'
          }
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            prefix: 'jb',
            style: 'camelCase',
            type: 'attribute'
          }
        ],
        /* eslint-plugin-prettier */
        'prettier/prettier': [
          'error',
          {
            printWidth: 140,
            trailingComma: 'none'
          }
        ]
      }
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        'prettier/prettier': [
          'error',
          {
            printWidth: 140
          }
        ]
      }
    }
  ]
};
