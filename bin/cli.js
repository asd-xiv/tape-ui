#!/usr/bin/env node

const { reduce } = require("@asd14/m")

// First args will always be the node path followed by interpreted file
const params = require("minimist")(process.argv.slice(2), {
  alias: {
    r: "require",
    p: "path",
    g: "glob",
  },
  string: ["require", "path", "glob"],
  default: {
    require: [],
    path: "src",
    glob: "**/*.test.js",
  },
})

require("../dist").default({
  require: reduce((acc, item) => [...acc, "-r", item], [])(
    Array.isArray(params.require) ? params.require : [params.require]
  ),
  path: params.path,
  pattern: params.glob,
})
