/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@coauthors/eslint-config-ts'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
