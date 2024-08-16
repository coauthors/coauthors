<div align="center">
  <a href="https://coauthors.me" title="coauthors">
    <img src="https://raw.githubusercontent.com/coauthors/coauthors/main/assets/banner.png" alt="coauthors" height="180" />
    <h1 align="center">Coauthors</h1>
  </a>
</div>










<div align="center">

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge&color=000&labelColor=000)](https://github.com/coauthors/coauthors/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/@coauthors/core?color=000&labelColor=000&logo=npm&label=&style=for-the-badge)](https://www.npmjs.com/package/@coauthors/core) [![npm](https://img.shields.io/npm/dm/@coauthors/core?color=000&labelColor=000&style=for-the-badge)](https://www.npmjs.com/package/@coauthors/core)

[![Coauthors friendly](https://img.shields.io/badge/Coauthors-friendly-blue.svg)](http://coauthors.me) [![codecov](https://codecov.io/gh/coauthors/coauthors/branch/main/graph/badge.svg?token=H4VQ71NJ16)](https://codecov.io/gh/coauthors/coauthors) ![GitHub stars](https://img.shields.io/github/stars/coauthors/coauthors?style=social) ![GitHub forks](https://img.shields.io/github/forks/coauthors/coauthors?style=social)

</div>

## Git Hook with Husky

### `coauthors`: Git hook prepare-commit-msg with husky

1. Setup with husky

   ```shell
   # .husky/prepare-commit-msg
   npx coauthors
   ```

2. Commit with coauthors simply

   ```shell
   git commit -m "chore: update

   coauthors: manudeli, 2-NOW(Whale)"
   ```

3. Commit message with coauthors prepare-commit-msg

   ```text
   chore: update

   Co-authored-by: Jonghyeon Ko <61593290+manudeli@users.noreply.github.com>
   Co-authored-by: Whale <71202076+2-NOW@users.noreply.github.com>
   ```

### `coauthors -m`: CLI to get commit message with coauthors

1. With coauthors

   ```shell
   npx coauthors -m "chore: update

   coauthors: manudeli, 2-NOW(Whale)"
   ```

   ```text
   chore: update

   Co-authored-by: Jonghyeon Ko <61593290+manudeli@users.noreply.github.com>
   Co-authored-by: Whale <71202076+2-NOW@users.noreply.github.com>
   ```

2. Without coauthors

   ```shell
   npx coauthors -m "chore: update"
   ```

   ```text
   chore: update
   ```

## Coauthors Generator

[Enter Link (https://coauthors.me)](https://coauthors.me/generator)

[![Coauthors Generator](https://raw.githubusercontent.com/coauthors/coauthors/main/docs/coauthors.me/public/img/generator-example.gif)](https://coauthors.me/generator)

## VSCode Extension

1. Icon on source control to add coauthor string easily

   [![Coauthors VSCode Extension Example 1](https://raw.githubusercontent.com/coauthors/coauthors/main/assets/example-vscode-extension-1.png)](https://coauthors.me)

2. Status bar item to use Coauthors generator easily

   [![Coauthors VSCode Extension Example 2](https://raw.githubusercontent.com/coauthors/coauthors/main/assets/example-vscode-extension-2.png)](https://coauthors.me)

## Contributing

Read our [Contributing Guide](./CONTRIBUTING.md) to familiarize yourself with Coauthors's development process, how to suggest bug fixes and improvements, and the steps for building and testing your changes.

### Contributors

[![contributors](https://contrib.rocks/image?repo=coauthors/coauthors)](https://github.com/coauthors/coauthors/graphs/contributors)

<br/>

## License

MIT © Coauthors. See [LICENSE](./LICENSE) for details.

<div align="center">
  <a title="Coauthors" href="https://github.com/coauthors">
    <div style='display:flex; align-items:center;'>
      <img alt="Coauthors" src="https://github.com/coauthors/coauthors/blob/main/assets/logo.png?raw=true" width="24">
      <sup>Coauthors</sup>
    </div>
  </a>
</div>
