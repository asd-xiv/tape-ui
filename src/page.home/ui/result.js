const blessed = require("neo-blessed")

const resultUI = ({ parent, top }) => {
  const contentBox = blessed.log({
    parent,
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    scrollable: true,
    scrollOnInput: true,

    top,
    height: "100%-4",

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
    ({ left, width, content }) => {
      contentBox.setContent(content)
      contentBox.width = width
      contentBox.position.left = left

      /**
       * Persist state data
       */

      contentBox._.width = width
      contentBox._.left = left
      contentBox._.content = content
    },
  ]
}

module.exports = { resultUI }
