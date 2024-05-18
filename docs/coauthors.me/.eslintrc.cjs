/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['@coauthors/eslint-config/react-ts', 'plugin:@next/next/recommended'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: 'tsconfig.json',
  },
}
