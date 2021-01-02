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
      if (value === "") {
        onCancel()
      } else {
        onChange(value.slice(0, Math.max(0, value.length - 1)))
      }
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
      input.setContent(value)

      /*
       * useEffect(() => {
       *   ...
       * }, [isVisible])
       */

      if (isVisible !== input._.isVisible) {
        if (isVisible === true) {
          label.show()
          input.show()
          input.focus()
        } else {
          label.hide()
          input.hide()
        }
      }

      /*
       * Local props, acts like prevProps
       */

      input._.value = value
      input._.isVisible = isVisible
    },
  ]
}

module.exports = { commandUI }
