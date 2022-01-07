module.exports = {
  env: {
    browser: true
    // "es2021": true
  },
  extends: ['standard'],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: 'module'
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'off'
  }
}
