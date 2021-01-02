const blessed = require("neo-blessed")
const { map, reduce } = require("m.xyz")

const tabsUI = ({ parent, top, tabs }) => {
  const props = { tabs }

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

      props.label = label
      props.width = width
      props.left = left
      props.selected = selected
    },
  ]
}

module.exports = { tabsUI }
