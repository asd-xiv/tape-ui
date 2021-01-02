const blessed = require("neo-blessed")
const { is } = require("m.xyz")

const asciiFrames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]

const loaderUI = ({ parent, top, left, height }) => {
  const labelBox = blessed.box({
    parent,
    tags: true,
    keys: false,
    vi: false,
    mouse: false,
    top,
    left,
    height,
  })

  let spinnerInterval = null
  let spinnerFrame = 0

  return [
    labelBox,
    ({ content, width, isLoading }) => {
      labelBox.setContent(
        isLoading ? `${asciiFrames[spinnerFrame]} ${content}` : `  ${content}`
      )
      labelBox.width = width

      /*
       * useEffect(() => {
       *   ...
       * }, [isLoading])
       */

      if (isLoading !== labelBox._.isLoading) {
        if (isLoading && !is(spinnerInterval)) {
          spinnerInterval = setInterval(() => {
            spinnerFrame = (spinnerFrame + 1) % asciiFrames.length

            labelBox.setContent(`${asciiFrames[spinnerFrame]} ${content}`)
            labelBox.screen.render()
          }, 70)
        }

        if (!isLoading && is(spinnerInterval)) {
          spinnerInterval = clearInterval(spinnerInterval)
        }
      }

      /*
       * Local props, acts like prevProps
       */

      labelBox._.content = content
      labelBox._.width = width
      labelBox._.isLoading = isLoading
    },
  ]
}

module.exports = { loaderUI }
