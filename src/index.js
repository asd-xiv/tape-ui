const blessed = require("neo-blessed")
const { reduce } = require("m.xyz")
const { fork } = require("child_process")

const pkg = require("../package.json")
const projectPkg = require(`${process.cwd()}/package.json`)

const fileList = require("./widgets/file.list")
const cliInput = require("./widgets/cli.input")
const resultTextbox = require("./widgets/result.textbox")

const executor = fork(`${__dirname}/lib/executor.js`)

const screen = blessed.screen({
  title: `${pkg.name} v${pkg.version}`,

  // The width of tabs within an element's content
  tabSize: 2,

  // Automatically position child elements with border and padding in mind
  autoPadding: true,

  // Whether the focused element grabs all keypresses
  grabKeys: true,

  // Prevent keypresses from being received by any element
  lockKeys: true,

  // Automatically "dock" borders with other elements instead of overlapping,
  // depending on position
  dockBorders: true,

  // Allow for rendering of East Asian double-width characters, utf-16
  // surrogate pairs, and unicode combining characters.
  fullUnicode: true,

  debug: true,
})

module.exports = ({ requireModules, fileGlob }) => {
  /**
   * List with test file names
   */

  const list = fileList({
    parent: screen,
    fileGlob,
  })

  /**
   * Text box with test results
   */

  const box = resultTextbox({
    parent: screen,
    label: `${projectPkg.name} v${projectPkg.version}`,
    width: `100%-${list.width - 1}`,
  })

  list.on("mark", (name, path) => {
    // box.setLabel(` ${name} `)
    box.setContent(JSON.stringify({ name, path }, 2, 2))

    executor.on("message", ({ stdout, stderr }) => {
      box.setContent(stdout + stderr)

      screen.render()
    })

    executor.send({
      path,
      runArgs: reduce((acc, item) => [...acc, "-r", item], [], requireModules),
    })

    screen.render()
  })

  list.focus()

  /**
   * Command Line Interface input for:
   *
   * - searching & highlighting through files
   */

  const input = cliInput({
    parent: screen,
    width: "100%",
    height: "1px",
    top: "100%-1",
    left: "0",
  })

  input.on("change", value => {
    list.setHighlight(value)

    screen.render()
  })

  input.on("cancel", () => {
    list.setHighlight("")
    input.hide()

    screen.render()
  })

  input.on("submit", () => {
    input.hide()

    screen.render()
  })

  input.hide()

  /**
   * Global shortcuts
   */

  screen.key("/", () => {
    input.setValue("")
    input.show()
    input.focus()
    input.setFront()

    screen.render()
  })

  screen.key("C-l", () => {
    list.setHighlight("")
    input.hide()

    screen.render()
  })

  screen.key("S-tab", () => {
    screen.focusPrevious()
    screen.render()
  })

  screen.key("tab", () => {
    screen.focusNext()
    screen.render()
  })

  /* eslint-disable unicorn/no-process-exit */
  screen.key(["C-c"], () => {
    return process.exit(0)
  })

  screen.render()
}
