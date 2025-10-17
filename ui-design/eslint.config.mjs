import { defineConfig } from 'eslint/config';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';

export default defineConfig([
  {
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
    },
    rules: {
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'class',
          format: ['PascalCase'],
        },
        {
          selector: 'variableLike',
          format: ['camelCase'],
        },
      ],
    },
    files: ['**/*.ts', '**/*.tsx'],
  },
]);
