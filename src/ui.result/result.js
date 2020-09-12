const blessed = require("neo-blessed")

const resultUI = ({ parent }) => {
  const labelBox = blessed.box({
    parent,
    tags: true,
    keys: false,
    vi: false,
    mouse: false,
    top: 0,
    right: 0,
    height: 1,
    align: "right",
  })

  const borderTopLine = blessed.line({
    parent,
    orientation: "horizontal",
    top: 1,
    right: 0,
    height: 1,
  })

  const contentBox = blessed.log({
    parent,
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollable: true,
    scrollOnInput: true,

    top: 2,
    right: 0,
    height: "100%-3",

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
        scrollbar: {
          bg: "blue",
        },
      },
    },
  })

  return [
    contentBox,
    ({ width, label, content }) => {
      labelBox.setContent(label)
      labelBox.position.width = width

      borderTopLine.position.width = width

      contentBox.setContent(content)
      contentBox.position.width = width

      /**
       * Persist state data
       */

      contentBox._.width = width
      contentBox._.label = label
      contentBox._.content = content
    },
  ]
}

module.exports = { resultUI }
