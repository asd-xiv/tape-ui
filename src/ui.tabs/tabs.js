const blessed = require("neo-blessed")
const { map, reduce } = require("m.xyz")

const tabsUI = ({ parent, top, tabs }) => {
  const labelBox = blessed.box({
    parent,
    tags: true,
    keys: false,
    vi: false,
    mouse: false,
    top,
    height: 1,
    right: 0,
  })

  const tabBoxes = map(item => {
    const box = blessed.box({
      parent,
      top,
      height: 1,
      width: item.length + 2,
      content: ` ${item} `,
    })

    box._.id = item

    return box
  }, tabs)

  const borderTopLine = blessed.line({
    parent,
    orientation: "horizontal",
    top: `${top}+1`,
    height: 1,
  })

  return [
    "",
    ({ label = "", width, left, selected }) => {
      labelBox.setContent(label)
      labelBox.width = label.length

      borderTopLine.width = width
      borderTopLine.position.left = left

      reduce(
        (acc, item) => {
          item.position.left = left + acc

          if (item._.id === selected) {
            item.style.bg = "blue"
          } else {
            item.style.bg = ""
          }

          return acc + item.getContent().length
        },
        0,
        tabBoxes
      )

      /**
       * Persist state data
       */

      labelBox._.label = label
      labelBox._.width = width
      labelBox._.left = left
      labelBox._.selected = selected
    },
  ]
}

module.exports = { tabsUI }
