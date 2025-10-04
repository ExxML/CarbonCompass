import js from '@eslint/js';
import globals from 'globals';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import pluginSecurity from 'eslint-plugin-security';
import pluginN from 'eslint-plugin-n';
import prettier from 'eslint-config-prettier';

export default [
  { ignores: ['node_modules', 'dist'] },
  js.configs.recommended,
  prettier,
  {
    files: ['src/**/*.js'], // your server files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module', // <-- ESM
      globals: globals.node,
    },
    plugins: { import: pluginImport, promise: pluginPromise, security: pluginSecurity, n: pluginN },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'import/order': [
        'warn',
        { 'newlines-between': 'always', alphabetize: { order: 'asc', caseInsensitive: true } },
      ],
      'n/no-missing-import': 'off',
    },
  },
];
