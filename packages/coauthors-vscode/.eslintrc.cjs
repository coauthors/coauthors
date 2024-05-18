/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@coauthors/eslint-config-ts'],
  ignorePatterns: ['dist', 'out', 'coverage'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
