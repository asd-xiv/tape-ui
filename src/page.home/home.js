const blessed = require("neo-blessed")
const {
  converge,
  read,
  pipe,
  map,
  count,
  max,
  push,
  contains,
  filterWith,
} = require("@asd14/m")

const { store, FileList } = require("../index.state")

const { filesUI } = require("./ui/files")
const { resultUI } = require("./ui/result")
const { commandUI } = require("./ui/cli")
const { tabsUI } = require("./ui/tabs")
const { helpUI } = require("./ui/help")

const homePage = ({ parent, testRunnerWorker, testRunArgs }) => {
  // Parent of all component's UI elements
  const baseRef = blessed.box({
    parent,
  })

  const [filesRef, renderFilesUI] = filesUI({
    parent: baseRef,

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

      testRunnerWorker.send({
        path,
        runArgs: testRunArgs,
      })

      FileList.update(path, {
        isRunning: true,
      })
    },
  })

  filesRef.focus()

  const [, renderResultUI] = resultUI({
    parent: baseRef,
    top: 2,
  })

  const [, renderTabsUI] = tabsUI({
    parent: baseRef,
    tabs: ["results", "details"],
    top: 0,
  })

  const [, renderHelpUI] = helpUI({
    parent: baseRef,
    width: "100%",
    left: 0,
    bottom: 0,
  })

  const [, renderCommandUI] = commandUI({
    parent: baseRef,
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

      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "isCLIVisible", value: false },
      })
    },

    onCancel: () => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "isCLIVisible", value: false },
      })
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "cliQuery", value: "" },
      })
    },

    onBlur: () => {
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "isCLIVisible", value: false },
      })
      store.dispatch({
        type: "USE-STATE.SET",
        payload: { id: "cliQuery", value: "" },
      })
    },
  })

  return [
    baseRef,
    () => {
      const currentState = store.getState()
      const [fileSelectId, tabsSelectId, cliQuery, isCLIVisible] = converge(
        (...params) => params,
        [
          read(["USE-STATE", "fileSelectId"], null),
          read(["USE-STATE", "tabsSelectId"], "results"),
          read(["USE-STATE", "cliQuery"], ""),
          read(["USE-STATE", "isCLIVisible"], false),
        ]
      )(currentState)
      const { items, byId } = FileList.selector(currentState)
      const { id, name, shouldRunOnChange, stdout } = byId(fileSelectId, {})
      const files = filterWith({ name: contains(cliQuery) })(items())
      const listWidth = pipe(
        map([read("name"), count]),
        push(20),
        max,
        source => source + 5
      )(files)

      renderTabsUI({
        label: name,
        left: listWidth,
        width: `100%-${listWidth}`,
        selected: tabsSelectId,
      })

      renderFilesUI({
        items: files,
        highlight: cliQuery,
        width: listWidth,
      })

      renderResultUI({
        left: listWidth,
        width: `100%-${listWidth}`,
        content:
          tabsSelectId === "results"
            ? stdout
            : JSON.stringify(
                {
                  path: id,
                  shouldRunOnChange,
                  command: ["node", id, ...testRunArgs],
                },
                null,
                2
              ),
      })

      renderHelpUI({
        isVisible: !isCLIVisible,
      })

      renderCommandUI({
        value: cliQuery,
        isVisible: isCLIVisible,
      })
    },
  ]
}

module.exports = { homePage }
