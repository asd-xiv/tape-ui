const { sep } = require("path")
const blessed = require("neo-blessed")
const glob = require("glob")
const {
  count,
  max,
  flatten,
  distinct,
  split,
  last,
  reduce,
  map,
  pipe,
  converge,
  findIndex,
  contains,
  replace,
  isEmpty,
} = require("m.xyz")

module.exports = ({ parent, fileGlob }) => {
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
      [item]: pipe(split(sep), last)(item),
    }),
    {},
    filePaths
  )

  const listWidth = pipe(Object.values, map(count), max)(pathNameMap) + 6

  // Separate title element since we cant have only borderTop
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

  list.setItems(
    pipe(
      Object.values,
      map(item => `{gray-fg}■{/gray-fg} ${item}`)
    )(pathNameMap)
  )

  list.on("select", (el, selected) => {
    const path = filePaths[selected]
    const name = pathNameMap[path]

    list.emit("run", name, path)
  })

  list.setHighlight = value => {
    pipe(
      Object.values,
      converge(
        (firstMatchIndex, highlightedItems) => {
          if (!isEmpty(value)) {
            list.select(firstMatchIndex)
          }
          list.setItems(highlightedItems)
        },
        [
          findIndex(contains(value)),
          map(
            item =>
              `{gray-fg}■{/gray-fg} ${replace(
                value,
                `{underline}${value}{/underline}`
              )(item)}`
          ),
        ]
      )
    )(pathNameMap)
  }

  return list
}
