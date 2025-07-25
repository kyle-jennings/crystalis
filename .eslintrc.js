module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    // think about using these in the future when we upgrade eslint and ts
    // 'eslint:recommended',
    // '@vue/airbnb',
    // 'plugin:vue/vue3-recommended',
    // '@vue/typescript/recommended',
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': ['off'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-shadow': 'error',
    camelcase: ['error', { properties: 'never' }],
    'no-console': 'warn',
    'no-debugger': 'warn',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'max-len': [
      'error', {
        code: 120,
        tabWidth: 2,
      },
    ],
    'no-plusplus': 'off',
    'no-shadow': 'off',
    'vuejs-accessibility/media-has-caption': 'off',
    'vue/no-v-model-argument': 'off',
    'vue/no-mutating-props': 'warn',
  },
  overrides: [
    {
      files: ['*.ts', '*.vue'],
      rules: {
        'no-undef': 'off',
      },
    },
  ],
  ignorePatterns:
  [
    '**/vendor/*.js',
    '**/node_modules/**/*',
    '**/dist',
    './src/components/GameCanvas/lib/**/*',
    'src/components/GameCanvas/lib/**/*',
    './src/game/**/*',
    'src/game/**/*',
  ],
};
