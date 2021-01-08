/* eslint-disable no-sync */

const espree = require("espree")
const fs = require("fs")
const path = require("path")
const { pipe, filterWith, startsWith, map, read } = require("@asd14/m")

const scanRequiredFiles = source => {
  const content = fs.readFileSync(source, "utf8")
  const ast = espree.parse(content, { ecmaVersion: 8, sourceType: "module" })

  return pipe(
    read("body"),
    filterWith({
      type: "ImportDeclaration",
    }),
    map([
      read(["source", "value"]),
      relativePath => ({
        isLocalFile: startsWith(".", relativePath),
        path: path.resolve(path.dirname(source), relativePath),
      }),
    ])
  )(ast)
}

module.exports = { scanRequiredFiles }
