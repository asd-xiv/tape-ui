const blessed = require("neo-blessed")
const {
  read,
  pipe,
  map,
  count,
  max,
  push,
  contains,
  filterWith,
} = require("@asd14/m")

const { store } = require("../index.state")

const { filesUI } = require("./ui/files")
const { resultUI } = require("./ui/result")
const { commandUI } = require("./ui/cli")
const { tabsUI } = require("./ui/tabs")
const { helpUI } = require("./ui/help")

const homePage = ({ parent, onFileSelect, onFileRun }) => {
  // Parent of all component's UI elements
  const baseRef = blessed.box({
    parent,
  })

  const [filesRef, renderFilesUI] = filesUI({
    parent: baseRef,
    onSelect: path => onFileSelect(path),
    onRun: path => onFileRun(path),
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
    ({ files, fileSelected = {}, tab, cliQuery, isCLIVisible }) => {
      const { id, name, dependsOnFiles, stdout } = fileSelected
      const filesFiltered = filterWith({ name: contains(cliQuery) }, files)
      const listWidth = pipe(
        map([read("name"), count]),
        push(20),
        max,
        source => source + 5
      )(filesFiltered)

      renderTabsUI({
        label: name,
        left: listWidth,
        width: `100%-${listWidth}`,
        selected: tab,
      })

      renderFilesUI({
        items: filesFiltered,
        highlight: cliQuery,
        width: listWidth,
      })

      renderResultUI({
        left: listWidth,
        width: `100%-${listWidth}`,
        content:
          tab === "results"
            ? stdout
            : JSON.stringify(
                {
                  path: id,
                  watch: dependsOnFiles,
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
