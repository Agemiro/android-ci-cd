// @ts-check
const eslint = require('@eslint/js');
const globals = require('globals');
const tseslintParser = require('@typescript-eslint/parser');
const tseslintPlugin = require('@typescript-eslint/eslint-plugin');
const angularPlugin = require('@angular-eslint/eslint-plugin');
const angularTemplatePlugin = require('@angular-eslint/eslint-plugin-template');
const angularTemplateParser = require('@angular-eslint/template-parser');

module.exports = [
  // Base ESLint recommended rules
  eslint.configs.recommended,

  // TypeScript files configuration
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
        ecmaVersion: 2022,
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.jasmine,
      },
    },
    plugins: {
      '@typescript-eslint': tseslintPlugin,
      '@angular-eslint': angularPlugin,
    },
    rules: {
      ...tseslintPlugin.configs.recommended.rules,
      ...angularPlugin.configs.recommended.rules,
      // Disable prefer-standalone for module-based apps
      '@angular-eslint/prefer-standalone': 'off',
      // Allow explicit any in zone-flags.ts
      '@typescript-eslint/no-explicit-any': ['warn', { ignoreRestArgs: true }],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },

  // HTML template files configuration
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      ...angularTemplatePlugin.configs.recommended.rules,
    },
  },
];
