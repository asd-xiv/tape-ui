<!-- markdownlint-disable line-length -->

# Tape UI [![npm package version](https://badge.fury.io/js/%40asd14%2Ftape-ui.svg)](https://badge.fury.io/js/%40asd14%2Ftape-ui)

> Terminal UI for [Tape](https://github.com/substack/tape) test runner

![Tape UI](docs/screenshot.png)

---

<!-- vim-markdown-toc GFM -->

* [Features](#features)
* [Install](#install)
* [Develop](#develop)
* [Use](#use)
* [Changelog](#changelog)
  * [0.6.1 - 21 January 2019](#061---21-january-2019)
    * [Change](#change)

<!-- vim-markdown-toc -->

## Features

* :floppy_disk: Terminal UI with VIM shortcuts
* :godmode: Tests run in parallel
* :mag: Selective run files

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

### 0.6.1 - 21 January 2019

#### Change

* Various UI changes
