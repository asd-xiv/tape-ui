/**
 * Runs via process.fork inside the main app.
 */

const dependencyTree = require("dependency-tree")
const { forEach } = require("@asd14/m")

process.on(
  "message",
  forEach(item => {
    process.send({
      path: item,
      dependsOnFiles: dependencyTree.toList({
        filename: item,
        directory: __dirname,
        filter: path => path.indexOf("node_modules") === -1,
      }),
    })
  })
)
