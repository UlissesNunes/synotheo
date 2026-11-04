const quote = (files) => files.map((file) => `"${file}"`).join(' ');

export default {
  'apps/web/**/*.{ts,tsx}': (files) => [
    `npm exec --workspace=apps/web -- eslint --fix --max-warnings=0 ${quote(files)}`,
    `npm exec --workspace=apps/web -- prettier --write ${quote(files)}`,
  ],
  'apps/web/**/*.{json,css,md}': (files) => [
    `npm exec --workspace=apps/web -- prettier --write ${quote(files)}`,
  ],
};