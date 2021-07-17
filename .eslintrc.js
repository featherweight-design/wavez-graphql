module.exports = {
  env: {
    browser: true,
    amd: true,
    node: true,
  },
  // Specifies the ESLint parser for TS
  parser: '@typescript-eslint/parser',
  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 2018,
    // Allows for the use of imports
    sourceType: 'module',
    project: './tsconfig.json',
  },
  ignorePatterns: ['**/notes/*.{js,json,md,ts}'],
  extends: [
    // Uses the recommended rules from Jest
    // 'plugin:jest/recommended',
    // Uses the recommended rules from eslint
    'eslint:recommended',
    // Uses the recommended rules from @typescript-eslint/eslint-plugin
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    // Enables eslint-plugin-prettier and eslint-config-prettier.
    // This will display prettier errors as ESLint errors.
    // Make sure this is always the last configuration in the extends array.
    'plugin:prettier/recommended',
  ],
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules
    // specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
    // Turned off due to conflict with the second rule below, which should be used with TS
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { variables: false }],
    // Turns off rule that conflicts with Prettier
    'comma-dangle': 'off',
    // Turns off rule that conflicts with Prettier
    'object-curly-newline': 'off',
    // Allows for iterable Promises with void return
    '@typescript-eslint/no-misused-promises': [
      'error',
      {
        checksVoidReturn: false,
      },
    ],
  },
  settings: {
    'import/resolver': {
      // This loads <rootdir>/tsconfig.json to eslint
      typescript: {},
    },
  },
};
