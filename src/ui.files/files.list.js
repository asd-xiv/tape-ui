const glob = require("glob")
const dependencyTree = require("dependency-tree")
const { sep } = require("path")
const { buildList } = require("just-a-list.redux")
const { flatten, distinct, split, last, map, pipe } = require("m.xyz")

const FileList = buildList({
  name: "FILES",

  // @signature (fileGlob: String[]): Object[]
  read: pipe(
    map(item => glob.sync(item, { absolute: true })),
    flatten,
    distinct,
    map(item => {
      return {
        id: item,
        name: pipe(split(sep), last)(item),
        isRunning: false,
        code: null,
      }
    })
  ),

  readOne: id => ({
    id,
    shouldRunOnChange: dependencyTree.toList({
      filename: id,
      directory: __dirname,
      filter: path => path.indexOf("node_modules") === -1,
    }),
  }),

  update: (id, data) => ({
    id,
    ...data,
  }),
})

module.exports = {
  FileList,
}
