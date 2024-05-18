/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: ['./react.js', '@coauthors/eslint-config-js'],
  rules: {
    'jsdoc/check-tag-names': ['warn', { jsxTags: true }],
    'jsdoc/require-param': ['off'],
  },
}
