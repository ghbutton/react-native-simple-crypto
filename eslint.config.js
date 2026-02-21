const js = require('@eslint/js');

module.exports = [
  {
    ignores: ['node_modules/', 'example/', 'eslint.config.js'],
  },
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        setTimeout: 'readonly',
        Uint8Array: 'readonly',
        ArrayBuffer: 'readonly',
        parseInt: 'readonly',
        encodeURI: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
];
