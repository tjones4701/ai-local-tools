module.exports = {
  extends: ['eslint:recommended', '@electron-toolkit/eslint-config-ts/recommended'],
  rules: {
    semi: ['error', 'always'],
    '@typescript-eslint/no-explicit-any': 'none'
  }
};
