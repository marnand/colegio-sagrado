import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import astro from 'eslint-plugin-astro';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import globals from 'globals';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript
  ...tseslint.configs.recommended,

  // React
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Enforce single quotes (from .editorconfig: quote_type = single)
      quotes: ['error', 'single', { avoidEscape: true }],
      'jsx-quotes': ['error', 'prefer-single'],

      // 2-space indentation (from .editorconfig: indent_size = 2, indent_style = space)
      indent: ['error', 2, { SwitchCase: 1 }],

      // LF line endings (from .editorconfig: end_of_line = lf)
      'linebreak-style': ['error', 'unix'],

      // Trim trailing whitespace (from .editorconfig: trim_trailing_whitespace = true)
      'no-trailing-spaces': 'error',

      // Final newline (from .editorconfig: insert_final_newline = true)
      'eol-last': ['error', 'always'],

      // React specific
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // Accessibility
      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/anchor-is-valid': 'warn',
    },
  },

  // Astro
  ...astro.configs.recommended,
  {
    files: ['**/*.astro'],
    rules: {
      // Astro components also use single quotes where applicable
      quotes: ['error', 'single', { avoidEscape: true }],
      'no-trailing-spaces': 'error',
      'eol-last': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
    },
  },

  // Global ignores
  {
    ignores: [
      'dist/**',
      '.astro/**',
      'node_modules/**',
    ],
  },
];
