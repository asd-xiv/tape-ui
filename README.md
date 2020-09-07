<!-- markdownlint-disable first-line-h1 line-length -->

[![CircleCI](https://circleci.com/gh/andreidmt/tape-ui/tree/master.svg?style=svg)](https://circleci.com/gh/andreidmt/tape-ui/tree/master)
[![npm version](https://badge.fury.io/js/tape-ui.svg)](https://www.npmjs.com/package/tape-ui)

# WIP: Tape UI

![Tape UI](screenshot.png)

---

<!-- vim-markdown-toc GFM -->

* [Features](#features)
* [Install](#install)
* [Use](#use)
* [Develop](#develop)
* [Changelog](#changelog)

<!-- vim-markdown-toc -->

## Features

* [x] Selectively run test files
* [ ] Run relevant test files based on file changes
* [ ] Test coverage

## Install

```bash
npm install tape-ui
```

## Use

Add script in `package.json`

```json
{
  "scripts": {
    "tdd": "tape-ui -r @babel/register 'src/**/*.test.js'",
  }
}
```

## Develop

```bash
git clone git@github.com:andreidmt/tape-ui.git && \
  cd tape-ui && \
  npm run setup

# run tests (any `*.test.js`) once
npm test

# watch `src` folder for changes and run test automatically
npm run tdd
```

## Changelog

See the [releases section](https://github.com/andreidmt/tape-ui/releases) for details.
