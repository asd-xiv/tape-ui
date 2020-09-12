const { flatten, distinct, split, last, map, pipe } = require("m.xyz")
const { buildList } = require("just-a-list.redux")
const { sep } = require("path")
const glob = require("glob")

const FileList = buildList({
  name: "FILES",

  // @signature (fileGlob: String[]): Object[]
  read: fileGlob => {
    return pipe(
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
    )(fileGlob)
  },

  update: (id, data) => ({
    id,
    ...data,
  }),
})

module.exports = {
  FileList,
}
