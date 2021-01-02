const blessed = require("neo-blessed")
const { reduce, forEach } = require("m.xyz")

const projectPkg = require(`${process.cwd()}/package.json`)

const { homePage } = require("./page.home/home")
const { loaderPage } = require("./page.loader/loader")

const { FileList, store } = require("./index.state")
const { useScanner } = require("./core.hooks/use-scanner/scanner.hook")
const { useRunner } = require("./core.hooks/use-runner/runner.hook")

/**
 * Main app function, called from "bin/cli.js"
 *
 * @param {String[]} props.requireModules asd
 * @param {String[]} props.fileGlob       asd
 */
module.exports = ({ requireModules, fileGlob }) => {
  const testRunArgs = reduce(
    (acc, item) => [...acc, "-r", item],
    [],
    requireModules
  )

  // Separate node process for offloading test execution
  const runnerWorker = useRunner({
    runArgs: testRunArgs,
    onFinish: ({ path, stdout, stderr, code }) => {
      FileList.update(path, {
        isRunning: false,
        stdout,
        stderr,
        code,
      })
    },
  })

  //
  const screen = blessed.screen({
    title: `${projectPkg.name} v${projectPkg.version}`,

    // The width of tabs within an element's content
    tabSize: 2,

    // Automatically position child elements with border and padding in mind
    autoPadding: true,

    // Whether the focused element grabs all keypresses
    grabKeys: false,

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

  // Left/Right arrow switch focus between file list and results
  screen.on("keypress", (code, key) => {
    if (key.full === "right") {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "focusId", value: "result" },
      })
    }

    if (key.full === "left") {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "focusId", value: "files" },
      })
    }
  })

  // Cycle through focusable elements
  screen.key("S-tab", () => {
    screen.focusPrevious()
  })
  screen.key("tab", () => {
    screen.focusNext()
  })

  // Switch to file result tab
  screen.key("1", () => {
    store.dispatch({
      type: "USE-STATE.SET",
      payload: { id: "tabsSelectId", value: "results" },
    })
  })

  // Switch to file details tab
  screen.key("2", () => {
    store.dispatch({
      type: "USE-STATE.SET",
      payload: { id: "tabsSelectId", value: "details" },
    })
  })

  // Open filter/cli input
  screen.key(["/", ":"], () => {
    store.dispatch({
      type: "USE-STATE.SET",
      payload: { id: "isCLIVisible", value: true },
    })
  })

  // Run all test files at once
  screen.key("S-r", () => {
    const { items } = FileList.selector(store.getState())

    forEach(({ id }) => {
      runnerWorker.send({
        path: id,
        runArgs: testRunArgs,
      })

      FileList.update(id, {
        isRunning: true,
      })
    })(items())
  })

  /**
   * High level UI components
   */

  const [homePageRef, renderHomePage] = homePage({
    parent: screen,
    onFileRun: path => {
      runnerWorker.send({ path, runArgs: testRunArgs })
    },
  })

  // Offload test file dependency scanning to separate node process
  const scannerWorker = useScanner({
    onFinish: ({ path, dependsOnFiles }) => {
      FileList.update(path, {
        dependsOnFiles,
      })
    },
  })

  const [loaderPageRef, renderLoaderPage] = loaderPage({
    parent: screen,
    glob: fileGlob,
    onFilesLoaded: fileArray => {
      scannerWorker.send(fileArray)
    },
  })

  /* eslint-disable unicorn/no-process-exit */
  screen.key(["C-c"], () => {
    scannerWorker.kill()
    runnerWorker.kill()
  })

  scannerWorker.on("close", () => (runnerWorker.killed ? process.exit() : null))
  runnerWorker.on("close", () => (scannerWorker.killed ? process.exit() : null))

  const renderApp = () => {
    const currentState = store.getState()
    const { items, isLoaded, error } = FileList.selector(currentState)

    const isBootstraped = false
    // all(hasKey("dependsOnFiles"), items())

    // console.log({ isBootstraped })

    if (isBootstraped) {
      renderHomePage()

      loaderPageRef.hide()
      homePageRef.show()
    } else {
      renderLoaderPage()

      loaderPageRef.show()
      homePageRef.hide()
    }

    // only call to screen.render in the app
    screen.render()
  }

  store.subscribe(() => {
    renderApp()
  })

  renderApp()
}
