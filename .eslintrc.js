module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    "cypress/globals": true
  },
  extends: [
    'airbnb-base',
    "plugin:cypress/recommended"
  ],
  plugins: [
    'cypress'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
  },
};
