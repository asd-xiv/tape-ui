const blessed = require("neo-blessed")
const {
  all,
  hasKey,
  pipe,
  reduce,
  forEach,
  read,
  readMany,
} = require("@asd14/m")

const projectPkg = require(`${process.cwd()}/package.json`)

const { homePage } = require("./page.home/home")
const { loaderPage } = require("./page.loader/loader")

const { FileList, store } = require("./index.state")
const { useScanner } = require("./core.hooks/use-scanner/scanner.hook")
const { useRunner } = require("./core.hooks/use-runner/runner.hook")

/**
 * Main app function, called from "bin/cli.js"
 *
 * @param {string[]} props.requireModules asd
 * @param {string[]} props.fileGlob       asd
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

    onFileSelect: id => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "fileSelectId", value: id },
      })
    },

    onFileRun: id => {
      runnerWorker.send({ path: id, runArgs: testRunArgs })

      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "fileSelectId", value: id },
      })

      FileList.update(id, {
        isRunning: true,
      })
    },
  })

  // Offload test file dependency scanning to separate node process
  const dependencyScannerWorker = useScanner({
    onFinish: ({ path, dependsOnFiles }) => {
      FileList.update(path, { dependsOnFiles })
    },
  })

  const [loaderPageRef, renderLoaderPage] = loaderPage({ parent: screen })

  /* eslint-disable unicorn/no-process-exit */
  screen.key(["C-c"], () => {
    dependencyScannerWorker.kill()
    runnerWorker.kill()
  })

  dependencyScannerWorker.on("close", () =>
    runnerWorker.killed ? process.exit() : null
  )
  runnerWorker.on("close", () =>
    dependencyScannerWorker.killed ? process.exit() : null
  )

  const renderApp = () => {
    const currentState = store.getState()
    const { items, byId, isLoaded, isLoading } = FileList.selector(currentState)
    const isFileDependencyScanFinished = all(hasKey("dependsOnFiles"), items())

    // Find all test files and scan for each file's dependencies
    if (!isLoading() && !isLoaded()) {
      FileList.read(fileGlob).then(({ result }) => {
        dependencyScannerWorker.send(readMany("id", null, result))
      })
    }

    if (isFileDependencyScanFinished) {
      renderHomePage({
        files: items(),
        fileSelected: pipe(
          read(["USE-STATE", "fileSelectId"]),
          byId
        )(currentState),
        tab: read(["USE-STATE", "tabsSelectId"], "results", currentState),
        cliQuery: read(["USE-STATE", "cliQuery"], "", currentState),
        isCLIVisible: read(["USE-STATE", "isCLIVisible"], false, currentState),
      })

      loaderPageRef.hide()
      homePageRef.show()
    } else {
      renderLoaderPage({
        fileGlob,
        files: items(),
        isLoaded: isLoaded(),
        isFileDependencyScanFinished,
      })

      loaderPageRef.show()
      homePageRef.hide()
    }

    // Only call to screen.render in the app
    screen.render()
  }

  // When any change occures in the Redux store, render the app
  store.subscribe(() => renderApp())

  // Kickstart the app
  renderApp()
}
