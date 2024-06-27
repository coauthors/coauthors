/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@coauthors/eslint-config-ts'],
  ignorePatterns: ['dist', 'coverage'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
