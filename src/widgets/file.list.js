const { sep } = require("path")
const blessed = require("neo-blessed")
const glob = require("glob")
const {
  count,
  read,
  max,
  flatten,
  distinct,
  split,
  last,
  reduce,
  map,
  pipe,
  converge,
  findIndexWith,
  contains,
  replace,
  isEmpty,
} = require("m.xyz")

module.exports = ({ parent, fileGlob }) => {
  /**
   * State
   */

  const filePaths = pipe(
    map(item =>
      glob.sync(item, {
        absolute: true,
      })
    ),
    flatten,
    distinct
  )(fileGlob)

  const pathNameMap = reduce(
    (acc, item) => ({
      ...acc,
      [item]: {
        name: pipe(split(sep), last)(item),
        isLoading: false,
        code: null,
      },
    }),
    {},
    filePaths
  )

  const listWidth =
    pipe(Object.values, map([read("name"), count]), max)(pathNameMap) + 6

  /**
   * Render
   */

  blessed.box({
    parent,
    tags: true,
    keys: false,
    vi: false,
    mouse: false,
    top: 0,
    left: 0,
    width: listWidth,
    height: 1,
    content: `${filePaths.length} test files`,
  })

  blessed.line({
    parent,
    orientation: "horizontal",
    top: 1,
    left: 0,
    width: listWidth,
    height: 1,
  })

  const list = blessed.list({
    parent,
    items: pipe(
      Object.values,
      map([read("name"), source => `{gray-fg}■{/gray-fg} ${source}`])
    )(pathNameMap),

    tags: true,
    keys: true,
    vi: true,
    mouse: true,

    padding: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 1,
    },

    top: 2,
    left: 0,
    height: "100%-3",
    width: listWidth,

    scrollbar: {
      style: {
        bg: "white",
      },
    },

    style: {
      border: {
        fg: "white",
      },

      focus: {
        border: {
          fg: "blue",
        },
        selected: {
          bg: "blue",
        },
        scrollbar: {
          bg: "blue",
        },
      },

      // Style for an unselected item
      item: {},

      // Style for a selected item
      selected: {
        bg: "white",
      },
    },
  })

  list.on("select", (el, selected) => {
    const path = filePaths[selected]
    const name = pathNameMap[path]

    list.emit("run", name, path)
  })

  list.setHighlight = query => {
    pipe(
      Object.values,
      converge(
        (firstMatchIndex, highlightedItems) => {
          if (!isEmpty(query)) {
            list.select(firstMatchIndex)
          }
          list.setItems(highlightedItems)
        },
        [
          findIndexWith({
            name: contains(query),
          }),
          map([
            read("name"),
            source =>
              `{gray-fg}■{/gray-fg} ${replace(
                query,
                `{underline}${query}{/underline}`
              )(source)}`,
          ]),
        ]
      )
    )(pathNameMap)
  }

  return list
}
