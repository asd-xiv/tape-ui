<!-- markdownlint-disable first-line-h1 line-length -->

# Tape UI [![npm package version](https://badge.fury.io/js/%40asd14%2Ftape-ui.svg)](https://badge.fury.io/js/%40asd14%2Ftape-ui)

![Tape UI](docs/screenshot.png)

> Terminal UI for [Tape](https://github.com/substack/tape) test runner
> - Parallel testing
> - Keyboard navigation with Vim shortcuts
> - Babel support

---

<!-- MarkdownTOC levels="2,3" autolink="true" autoanchor="false" -->

- [Install](#install)
- [Develop](#develop)
- [Use](#use)
- [Changelog](#changelog)
    - [0.4.0 - 6 January 2019](#040---6-january-2019)

<!-- /MarkdownTOC -->

## Install

```bash
npm i --save-exact @asd14/tape-ui
```

## Develop

```bash
git clone git@github.com:asd14/tape-ui.git && \
  cd tape-ui && \
  npm run setup

# run tests (any `*.test.js`) once
npm test

# watch `src` folder for changes and run test automatically
npm run tdd
```

## Use

Add script in `package.json`

```json
{
  "scripts": {
    "tdd": "tape-ui -r @babel/register -p src -g '**/*.test.js'",
  }
}
```

## Changelog

History of all changes in [CHANGELOG.md](CHANGELOG.md)

### 0.4.0 - 6 January 2019

#### Add

- Keyboad navigation in main list: up, down, home, end, page-up, page-down and space for "Run file"
