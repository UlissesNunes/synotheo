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
  // 1. Bases: regras do Next e do typescript-eslint no modo estrito
  ...nextVitals,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,

  // 2. Liga a leitura de tipos pelo tsconfig
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // 3. Arquivos JS de configuração ficam sem regras de tipos
  {
    files: ['**/*.js', '**/*.mjs'],
    extends: [tseslint.configs.disableTypeChecked],
  },

  // 4. Regras que valem para qualquer arquivo
  {
    plugins: { 'simple-import-sort': simpleImportSort },
    rules: {
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
    },
  },

  // 5. Ajustes de regras com tipos (só TypeScript)
  {
    files: ['**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
    },
  },

  // 6. Fronteiras da arquitetura
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

  // 7. Prettier por último: desliga regras de estilo que conflitam
  prettier,

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
