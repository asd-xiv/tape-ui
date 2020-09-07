const blessed = require("neo-blessed")

module.exports = ({ parent, label, width }) => {
  // Separate title element since we cant have only borderTop
  blessed.box({
    parent,
    tags: true,
    keys: false,
    vi: false,
    mouse: false,
    top: 0,
    right: 0,
    width,
    height: 1,
    content: label,
    align: "right",
  })

  blessed.line({
    parent,
    orientation: "horizontal",
    top: 1,
    right: 0,
    width,
    height: 1,
  })

  const box = blessed.box({
    parent,
    tags: true,
    keys: true,
    vi: true,
    mouse: true,

    padding: 0,
    top: 2,
    right: 0,
    width,
    height: "100%-1",

    style: {
      border: {
        fg: "white",
      },
      focus: {
        border: {
          fg: "blue",
        },
      },
    },
  })

  return box
}
