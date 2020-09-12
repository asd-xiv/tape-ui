const blessed = require("neo-blessed")
const { converge, reduce, read, pipe, map, count, max } = require("m.xyz")
const { fork } = require("child_process")

const projectPkg = require(`${process.cwd()}/package.json`)
const { filesUI } = require("./ui.files/files")
const { resultUI } = require("./ui.result/result")
const { commandUI } = require("./ui.cli/cli")

const { FileList } = require("./ui.files/files.list")
const { store } = require("./index.state")

//
module.exports = ({ requireModules, fileGlob }) => {
  const executorRunArgs = reduce(
    (acc, item) => [...acc, "-r", item],
    [],
    requireModules
  )

  // Separate node process to offload test file execution
  const executor = fork(`${__dirname}/lib/executor.js`, executorRunArgs)

  executor.on("message", ({ path, stdout, stderr, code }) => {
    FileList.update(path, {
      isRunning: false,
      stdout,
      stderr,
      code,
    })
  })

  /**
   *
   */

  const screen = blessed.screen({
    title: `${projectPkg.name} v${projectPkg.version}`,

    // The width of tabs within an element's content
    tabSize: 2,

    // Automatically position child elements with border and padding in mind
    autoPadding: true,

    // Whether the focused element grabs all keypresses
    grabKeys: true,

    // Prevent keypresses from being received by any element
    // lockKeys: true,

    // Automatically "dock" borders with other elements instead of overlapping,
    // depending on position
    dockBorders: true,

    // Allow for rendering of East Asian double-width characters, utf-16
    // surrogate pairs, and unicode combining characters.
    fullUnicode: true,

    debug: true,
  })

  /**
   * List with test file names
   */

  const [filesRef, renderFilesUI] = filesUI({
    parent: screen,
    onChange: path => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "fileSelectId", value: path },
      })
    },
    onRun: path => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "fileSelectId", value: path },
      })

      executor.send({
        path,
        runArgs: executorRunArgs,
      })

      FileList.update(path, {
        isRunning: true,
      })
    },
  })

  filesRef.focus()

  /**
   * Text box with test results
   */

  const [resultRef, renderResultUI] = resultUI({
    parent: screen,
  })

  /**
   * Command Line Interface input for:
   *
   * - searching & highlighting through files
   */

  const handleCLIHide = () => {
    store.dispatch({
      type: "USE-STATE.SET",
      payload: { id: "isCLIVisible", value: false },
    })
  }

  const [, renderCommandUI] = commandUI({
    parent: screen,
    width: "100%",
    height: "1px",
    top: "100%-1",
    left: "0",
    onChange: source => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "cliQuery", value: source },
      })
    },
    onSubmit: source => {
      filesRef.selectFirstWith(source)

      handleCLIHide()
    },
    onCancel: handleCLIHide,
    onBlur: handleCLIHide,
  })

  screen.on("keypress", (code, key) => {
    if (key.full === "right") {
      resultRef.focus()
    }

    if (key.full === "left") {
      filesRef.focus()
    }
  })

  screen.key("/", () => {
    store.dispatch({
      type: "USE-STATE.SET",
      payload: { id: "isCLIVisible", value: true },
    })
  })

  screen.key("S-tab", () => {
    screen.focusPrevious()
  })

  screen.key("tab", () => {
    screen.focusNext()
  })

  /* eslint-disable unicorn/no-process-exit */
  screen.key(["C-c"], () => {
    return process.exit(0)
  })

  // Load all files matching glob
  FileList.read(fileGlob)

  /*
   * When any part of state changes, re-render all UI wigets
   */
  store.subscribe(() => {
    const currentState = store.getState()
    const [cliQuery, fileSelectId, isCLIVisible] = converge(
      (...params) => params,
      [
        read(["USE-STATE", "cliQuery"], ""),
        read(["USE-STATE", "fileSelectId"], null),
        read(["USE-STATE", "isCLIVisible"], false),
      ]
    )(currentState)

    //
    const { items, byId } = FileList.selector(currentState)
    const files = items()
    const listWidth = pipe(map([read("name"), count]), max)(files) + 6

    renderFilesUI({
      items: files,
      highlight: cliQuery,
      width: listWidth,
    })

    //
    const { name, stdout } = byId(fileSelectId, {})

    renderResultUI({
      width: `100%-${listWidth}`,
      label: name,
      content: stdout,
    })

    //
    renderCommandUI({
      value: cliQuery,
      isVisible: isCLIVisible,
    })

    screen.render()
  })
}
