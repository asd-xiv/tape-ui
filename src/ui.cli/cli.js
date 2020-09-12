const blessed = require("neo-blessed")

const commandUI = ({
  parent,
  width,
  height,
  top,
  left,
  onChange,
  onCancel,
  onSubmit,
  onBlur,
}) => {
  const label = blessed.box({
    parent,
    style: {
      bg: "gray",
    },
    content: "/",
    left,
    top,
  })

  const input = blessed.text({
    parent,
    tags: true,
    keys: true,
    vi: true,
    mouse: true,
    style: {
      bg: "gray",
    },
    width,
    height,
    top,
    left: `${left}+1`,
  })

  input.on("blur", onBlur)

  input.on("keypress", (code, key) => {
    const value = input.getContent()

    if (/[\d .=A-Za-z\-]/.test(code)) {
      onChange(`${value}${code}`)
    }

    if (key.full === "backspace") {
      onChange(value.substr(0, value.length - 1))
    }

    if (key.full === "escape") {
      onCancel()
    }

    if (key.full === "enter") {
      onSubmit(value)
    }
  })

  return [
    input,
    ({ value, isVisible }) => {
      if (isVisible) {
        label.show()
        input.show()
      } else {
        label.hide()
        input.hide()
      }

      input.setContent(value)

      /*
       * Similar to:
       *
       * useEffect(() => {
       *   if (isVisible === true) {}
       * }, [isVisible])
       */

      if (isVisible !== input._.isVisible && isVisible === true) {
        input.focus()
      }

      /**
       * Persist state data
       */

      input._.value = value
      input._.isVisible = isVisible
    },
  ]
}

module.exports = { commandUI }
