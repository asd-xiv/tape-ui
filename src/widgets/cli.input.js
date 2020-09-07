const { isEmpty } = require("m.xyz")
const blessed = require("neo-blessed")

module.exports = ({ parent, width, height, top, left }) => {
  let value = ""
  const input = blessed.text({
    parent,
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    style: {},
    width,
    height,
    top,
    left,
  })

  input.on("keypress", (code, key) => {
    if (!isEmpty(code) && /[\d .=A-Za-z\-]/.test(code)) {
      value = `${value}${code}`
      input.setContent(`/${value}`)

      input.emit("change", value)
    }

    if (key.full === "backspace") {
      if (value.length === 0) {
        value = ""
        input.setContent(`/${value}`)

        input.emit("cancel")
      } else {
        value = value.substr(0, value.length - 1)
        input.setContent(`/${value}`)

        input.emit("change", value)
      }
    }

    if (key.full === "escape") {
      value = ""
      input.setContent(`/${value}`)

      input.emit("cancel")
    }

    if (key.full === "enter") {
      value = ""
      input.setContent(`/${value}`)

      input.emit("submit", value)
    }
  })

  input.setValue = source => {
    input.setContent(`/${source}`)
  }

  return input
}
