// @flow

import * as React from "react"
import glob from "glob"
import { fork } from "child_process"
import { basename } from "path"
import { has, forEach, reduce, map } from "@asd14/m"

import { AppView } from "./app.view"

type TestFile = {|
  path: string,
  name: string,
  stdout: string,
  stderr: string,
  code: number,
  isLoading: boolean,
|}

type Props = {|
  screen: Object,
  name: string,
  version: string,
  projectName: string,
  projectVersion: string,
  requireModules: string[],
  filePattern: string,
  rootPath: string,
|}

type State = {
  files: TestFile[],
  fileSelectedPath: string,
  filterQuery: string,
  runArgs: string[],
  isDebugVisible: boolean,
  isFilterVisible: boolean,
}

type Actions = {
  xHandleChangeSelected: (path: string) => void,
  xHandleRun: (paths: string | string[]) => void,
  xHandleDetailsToggle: () => void,
  xHandleFilterOpen: () => void,
  xHandleFilterClose: () => void,
  xHandleFilterChange: (query: string) => void,
  xHandleFilterSubmit: () => void,
}

class AppContainer extends React.Component<Props, State> {
  /**
   * The constructor for a React component is called before it is mounted.
   * When implementing the constructor for a React.Component subclass, you
   * should call super(props) before any other statement. Otherwise,
   * this.props will be undefined in the constructor, which can lead to bugs.
   *
   * DO
   *    - set initial state
   *    - if not using class properties syntax—prepare all class fields and
   *    bind functions that will be passed as callbacks
   *
   * DON'T
   *    - cause any side effects (AJAX calls etc.)
   *
   * @param {Object}  props  The properties
   */
  constructor(props: Props) {
    super(props)

    const { requireModules, filePattern, rootPath } = props
    const filePaths = glob.sync(`**/${filePattern}`, {
      absolute: true,
      cwd: rootPath,
    })

    // Offloading all file execution to secondary process
    this.executor = fork(`${__dirname}/../lib/executor.js`)
    this.executorRunArgs = reduce(
      (acc, item): string[] => [...acc, "-r", item],
      []
    )(requireModules)

    // Update state with file data coming from secondary forked process
    this.executor &&
      this.executor.on("message", (file: TestFile) => {
        const { files } = this.state

        this.setState({
          files: map(item =>
            item.path === file.path
              ? {
                  ...item,
                  ...file,
                  isLoading: false,
                }
              : item
          )(files),
        })
      })

    // default state
    this.state = {
      files: map(
        (item): TestFile => ({
          path: item,
          name: basename(item),
          stdout: "",
          stderr: "",
          code: -1,
          isLoading: false,
        })
      )(filePaths),
      fileSelectedPath: filePaths[0],
      filterQuery: "",
      runArgs: this.executorRunArgs,
      isDebugVisible: false,
      isFilterVisible: false,
    }
  }

  /**
   * This function will be called only once in the whole life-cycle of a given
   * component and it being called signalizes that the component and all its
   * sub-components rendered properly.
   *
   * DO
   *  - cause side effects (AJAX calls etc.)
   *
   * DON'T
   *  - call this.setState as it will result in a re-render
   */
  componentDidMount = () => {
    const { screen } = this.props

    screen.key(["i"], () => {
      this.handleDetailsToggle()
    })

    screen.key(["/"], () => {
      this.handleFilterOpen()
    })

    screen.key(["tab"], () => {
      screen.focusNext()
    })

    screen.key(["escape"], () => {
      const { isFilterVisible } = this.state

      isFilterVisible && this.handleFilterClose()
    })

    screen.onceKey(["C-c"], () => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    })
  }

  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const { name, version, projectName, projectVersion } = this.props
    const {
      files,
      fileSelectedPath,
      filterQuery,
      runArgs,
      isDebugVisible,
      isFilterVisible,
    } = this.state

    return (
      <AppView
        name={name}
        version={version}
        projectName={projectName}
        projectVersion={projectVersion}
        store={{
          files,
          fileSelectedPath,
          filterQuery,
          runArgs,
          isDebugVisible,
          isFilterVisible,
        }}
        actions={{
          xHandleChangeSelected: this.handleChangeSelected,
          xHandleRun: this.handleRun,
          xHandleDetailsToggle: this.handleDetailsToggle,
          xHandleFilterChange: this.handleFilterChange,
          xHandleFilterOpen: this.handleFilterOpen,
          xHandleFilterSubmit: this.handleFilterSubmit,
          xHandleFilterClose: this.handleFilterClose,
        }}
      />
    )
  }

  /**
   * Send file(s) to get executed by secondary executor process
   *
   * @param {string|string[]} path File path
   *
   * @returns {undefined}
   */
  handleRun = (path: string | string[]) => {
    const { files } = this.state
    const paths = Array.isArray(path) ? path : [path]

    this.setState({
      files: map(item =>
        has(item.path)(paths)
          ? {
              ...item,
              code: -1,
              signal: "",
              isLoading: true,
            }
          : item
      )(files),
    })

    // send file to secondary process for execution
    forEach(item => {
      this.executor &&
        this.executor.send({ path: item, runArgs: this.executorRunArgs })
    })(paths)
  }

  handleChangeSelected = (path: string) => {
    this.setState({
      fileSelectedPath: path,
    })
  }

  handleDetailsToggle = () => {
    this.setState(prevState => ({
      isDebugVisible: !prevState.isDebugVisible,
    }))
  }

  handleFilterOpen = () => {
    this.setState({
      isFilterVisible: true,
    })
  }

  handleFilterClose = () => {
    this.setState({
      filterQuery: "",
      isFilterVisible: false,
    })
  }

  handleFilterChange = (query: string) => {
    this.setState({
      filterQuery: query,
    })
  }

  handleFilterSubmit = () => {
    this.setState({
      isFilterVisible: false,
    })
  }

  executor = undefined

  executorRunArgs = []
}

export { AppContainer }
export type { State as AppState, Actions as AppActions, TestFile }
