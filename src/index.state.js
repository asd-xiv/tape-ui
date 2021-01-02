const glob = require("glob")
// const dependencyTree = require("dependency-tree")
const { sep } = require("path")
const { buildList } = require("just-a-list.redux")
const { createStore, combineReducers } = require("redux")
const { flatten, distinct, split, last, map, pipe } = require("m.xyz")

/**
 *
 */
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
        code: null,
        isRunning: false,
      }
    })
  ),

  update: (id, data) => ({
    id,
    ...data,
  }),
})

/**
 *
 */
const store = createStore(
  combineReducers({
    "USE-STATE": (state = {}, { type, payload: { id, value } = {} }) => {
      switch (type) {
        case "USE-STATE.SET":
          return {
            ...state,
            [id]: value,
          }
        default:
          return state
      }
    },
    [FileList.name]: FileList.reducer,
  })
)

FileList.set({ dispatch: store.dispatch })

module.exports = { FileList, store }
