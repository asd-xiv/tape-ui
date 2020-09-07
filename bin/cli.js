#!/usr/bin/env node

const { isEmpty } = require("m.xyz")

// First args will always be the node path followed by interpreted file
const params = require("minimist")(process.argv.slice(2), {
  alias: {
    r: "require",
  },
  string: ["require"],
  default: {
    require: [],
  },
})

require("../src")({
  requireModules: Array.isArray(params.r) ? params.r : [params.r],
  fileGlob: isEmpty(params._) ? ["src/**/*.test.js"] : params._,
})
