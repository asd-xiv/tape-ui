const blessed = require("neo-blessed")
const isDeepEqual = require("fast-deep-equal")
const {
  read,
  map,
  hasWith,
  replace,
  findIndexWith,
  contains,
  is,
} = require("@asd14/m")

const { loaderUI } = require("../../core.ui/loader")

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

  list.selectNext = () => {
    const selectedId = list._.selectedId
    const items = list._.items
    const index = findIndexWith({ id: contains(selectedId) }, items)

    if (index < items.length) {
      onChange(read([index + 1, "id"])(items))
    }
  }

  list.selectPrev = () => {
    const selectedId = list._.selectedId
    const items = list._.items
    const index = findIndexWith({ id: contains(selectedId) }, items)

    if (index > 0) {
      onChange(read([index - 1, "id"])(items))
    }
  }

  return [
    list,

    ({ selectedId, items, highlight, width }) => {
      /*
       * useEffect(() => {
       * }, [selectedId])
       */

      const prevSelectedId = list._.selectedId

      if (selectedId !== prevSelectedId) {
        if (is(prevSelectedId)) {
        }
      }

      /*
       * useEffect(() => {
       * }, [items, highlight])
       */

      const prevHighlight = list._.highlight
      const prevItems = list._.items

      if (!isDeepEqual(items, prevItems) || highlight !== prevHighlight) {
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

      renderLoaderUI({
        content: `${items.length} test files`,
        width,
        isLoading: hasWith({ isRunning: true }, items),
      })

      borderTopLine.width = width
      list.width = width

      /*
       * Local props, acts like prevProps
       */

      list._.selectedId = selectedId
      list._.items = items
      list._.highlight = highlight
      list._.width = width
    },
  ]
}

module.exports = {
  filesUI,
}
