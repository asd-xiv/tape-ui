const blessed = require("neo-blessed")
const { map, pipe, join } = require("@asd14/m")

const helpUI = ({ parent, width, left, bottom }) => {
  const shortcutList = [
    { key: "1", label: "results" },
    { key: "2", label: "details" },
    { key: "/", label: "filter" },
    { key: "r", label: "run" },
    { key: "shift+r", label: "run all" },
  ]

  const contentBox = blessed.box({
    parent,
    tags: true,

    width,
    height: 1,
    left,
    bottom,

    content: pipe(
      map(({ key, label }) => ` ${key} {white-bg}{black-fg}${label}{/}`),
      join("")
    )(shortcutList),
  })

  blessed.line({
    parent,
    orientation: "horizontal",
    top: "100%-2",
    left,
    width,
    height: 1,
  })

  return [
    contentBox,
    (isVisible = true) => {
      /*
       * useEffect(() => {
       *   ...
       * }, [isVisible])
       */

      if (isVisible !== contentBox._.isVisible) {
        if (isVisible) {
          contentBox.show()
        } else {
          contentBox.hide()
        }
      }

      /*
       * Local props, acts like prevProps
       */

      contentBox._.isVisible = isVisible
    },
  ]
}

module.exports = { helpUI }
