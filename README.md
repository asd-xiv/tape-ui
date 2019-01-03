<!-- markdownlint-disable first-line-h1 line-length -->

[![npm package version](https://badge.fury.io/js/%40asd14%2Ftape-ui.svg)](https://badge.fury.io/js/%40asd14%2Ftape-ui)

# Tape UI

> Terminal UI for [Tape](https://github.com/substack/tape) test runner

---

<!-- MarkdownTOC levels="2,3" autolink="true" autoanchor="false" -->

- [Install](#install)
- [Develop](#develop)
- [Use](#use)
- [Changelog](#changelog)
    - [0.2.0 - 3 January 2019](#020---3-january-2019)

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

## Changelog

History of all changes in [CHANGELOG.md](CHANGELOG.md)

### 0.2.0 - 3 January 2019

#### Add

- [`UIDebug`](src/ui/debug/debug.jsx) component
- Babel support by passing `-r` parameter to internal `tape` process
