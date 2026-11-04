import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import prettier from 'eslint-config-prettier/flat';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import tseslint from 'typescript-eslint';

const PUBLIC_API_RULE = {
  group: ['@/features/*/*'],
  message: 'Importe a feature pela API pública: @/features/<nome>.',
};

export default defineConfig([
  ...nextVitals,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },

  {
    files: ['src/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': ['error', { patterns: [PUBLIC_API_RULE] }],
    },
  },

  {
    files: ['src/shared/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            PUBLIC_API_RULE,
            {
              group: ['@/features', '@/features/*', '@/app', '@/app/*'],
              message: 'shared não pode depender de features nem de app.',
            },
          ],
        },
      ],
    },
  },

  prettier,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
