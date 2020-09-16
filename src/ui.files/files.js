const blessed = require("neo-blessed")
const isDeepEqual = require("fast-deep-equal")
const {
  read,
  map,
  hasWith,
  replace,
  findIndexWith,
  contains,
} = require("m.xyz")

const { loaderUI } = require("../ui.loader/loader")

const filesUI = ({ parent, onRun, onChange }) => {
  const [, renderLoaderUI] = loaderUI({
    parent,
    top: 0,
    left: 0,
    height: 1,
  })

  const borderTopLine = blessed.line({
    parent,
    orientation: "horizontal",
    top: 1,
    left: 0,
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
    height: "100%-4",

    scrollbar: {
      style: {
        bg: "white",
      },
    },

    style: {
      focus: {
        selected: {
          bg: "gray",
        },
        scrollbar: {
          bg: "blue",
        },
      },

      // Unselected item
      item: {},

      // Selected item
      selected: {
        // bg: "gray",
      },
    },
  })

  list.key(["down", "up"], () => {
    onChange(read([list.selected, "id"], null)(list._.items), list.selected)
  })

  list.key("r", () => {
    onRun(read([list.selected, "id"], null)(list._.items), list.selected)
  })

  list.on("element click", () => {
    onChange(read([list.selected, "id"], null)(list._.items), list.selected)
  })

  list.selectFirstWith = source => {
    const index = findIndexWith({ name: contains(source) }, list._.items)

    if (index !== -1) {
      list.select(index)
    }
  }

  return [
    list,

    ({ items, highlight, width }) => {
      renderLoaderUI({
        content: `${items.length} test files`,
        width,
        isLoading: hasWith({ isRunning: true }, items),
      })

      borderTopLine.width = width
      list.width = width

      /*
       * useEffect(() => {
       *   ...
       * }, [items, highlight])
       */

      if (!isDeepEqual(items, list._.items) || highlight !== list._.highlight) {
        list.setItems(
          map(({ name, code, isRunning }) => {
            const color = isRunning
              ? "blue"
              : code === 0
              ? "green"
              : code === null
              ? "gray"
              : "red"
            const text = replace(
              highlight,
              `{yellow-bg}{black-fg}${highlight}{/black-fg}{/yellow-bg}`
            )(name)

            return `{${color}-fg}■{/} ${text}`
          }, items)
        )
      }

      /*
       * Local props, acts like prevProps
       */

      list._.items = items
      list._.highlight = highlight
      list._.width = width
    },
  ]
}

module.exports = {
  filesUI,
}
