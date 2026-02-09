import nextPlugin from '@next/eslint-plugin-next'
import eslintConfigPrettier from 'eslint-config-prettier'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  ...tseslint.configs.recommended,
  {
    plugins: {
      react,
      'react-hooks': reactHooks,
      '@next/next': nextPlugin,
      'jsx-a11y': jsxA11y,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // Next.js
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,

      // React hooks
      ...reactHooks.configs.recommended.rules,

      // Auto-remove unused imports
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Padding lines
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: '*', next: 'return' },
        { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
        {
          blankLine: 'any',
          prev: ['const', 'let', 'var'],
          next: ['const', 'let', 'var'],
        },
        { blankLine: 'always', prev: '*', next: 'if' },
        { blankLine: 'always', prev: 'if', next: '*' },
      ],

      // React
      'react/react-in-jsx-scope': 'off',
      'react/self-closing-comp': ['error', { component: true, html: true }],
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'always', children: 'ignore' },
      ],
    },
  },
  {
    files: ['src/components/ui/**/*.tsx'],
    rules: {
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      'unused-imports/no-unused-imports': 'off',
      'unused-imports/no-unused-vars': 'off',
      'simple-import-sort/imports': 'off',
      'simple-import-sort/exports': 'off',
      'react/jsx-curly-brace-presence': 'off',
      'padding-line-between-statements': 'off',
    },
  },
  eslintConfigPrettier,
)
