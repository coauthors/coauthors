/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['./react.js', '@coauthors/eslint-config-ts/no-import'],
  rules: {
    'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
    'jsdoc/require-param': ['off'],
  },
}
