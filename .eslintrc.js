module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
  globals: {
    module: true,
    test: true,
    it: true,
    describe: true,
    beforeEach: true,
    afterEach: true,
    beforeAll: true,
    afterAll: true,
    expect: true,
  },
}
