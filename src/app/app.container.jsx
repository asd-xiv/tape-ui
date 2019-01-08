// @flow

import * as React from "react"
import glob from "glob"
import { basename } from "path"
import { reduce, map } from "@asd14/m"

import {
  handleTestFileRun,
  handleDebugToggle,
  handleFilterChange,
  handleFilterOpen,
  handleFilterSubmit,
  handleFilterClose,
} from "./actions"
import { AppView } from "./app.view"

type TestFilesType = {|
  path: string,
  name: string,
  content: string[],
  code: number,
  signal: string,
  isLoading: boolean,
|}

type PropsType = {|
  screen: Object,
  name: string,
  version: string,
  projectName: string,
  projectVersion: string,
  requireModules: string[],
  filePattern: string,
  rootPath: string,
|}

type StateType = {
  files: TestFilesType[],
  filesSelectedPath: string,
  filesFilter: string,
  runArgs: string[],
  isDebugVisible: boolean,
  isFilterVisible: boolean,
}

type ActionsType = {
  xHandleFileRun: (path: string) => void,
  xHandleDebugToggle: () => void,
  xHandleFilterChange: (value: string) => void,
  xHandleFilterOpen: () => void,
  xHandleFilterSubmit: (value: string) => void,
  xHandleFilterClose: (value: string) => void,
}

class AppContainer extends React.Component<PropsType, StateType> {
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
  constructor(props: PropsType) {
    super(props)

    const { requireModules, filePattern, rootPath } = props

    this.state = {
      files: map(
        (item): TestFilesType => ({
          path: item,
          name: basename(item),
          content: [],
          code: -1,
          signal: "",
          isLoading: false,
        })
      )(
        glob.sync(`**/${filePattern}`, {
          absolute: true,
          cwd: rootPath,
        })
      ),
      filesSelectedPath: "",
      filesFilter: "",
      runArgs: reduce((acc, item): string[] => [...acc, "-r", item], [])(
        requireModules
      ),
      isDebugVisible: false,
      isFilterVisible: false,
    }

    this.xHandleDebugToggle = handleDebugToggle(this.setState.bind(this))
    this.xHandleFilterChange = handleFilterChange(this.setState.bind(this))
    this.xHandleFilterOpen = handleFilterOpen(this.setState.bind(this))
    this.xHandleFilterSubmit = handleFilterSubmit(this.setState.bind(this))
    this.xHandleFilterClose = handleFilterClose(this.setState.bind(this))
    this.xHandleFileRun = handleTestFileRun(
      this.state,
      this.setState.bind(this)
    )
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
      this.xHandleDebugToggle()
    })

    screen.key(["/"], () => {
      this.xHandleFilterOpen()
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
      filesSelectedPath,
      filesFilter,
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
          filesSelectedPath,
          filesFilter,
          runArgs,
          isDebugVisible,
          isFilterVisible,
        }}
        actions={{
          xHandleFileRun: this.xHandleFileRun,
          xHandleDebugToggle: this.xHandleDebugToggle,
          xHandleFilterChange: this.xHandleFilterChange,
          xHandleFilterOpen: this.xHandleFilterOpen,
          xHandleFilterSubmit: this.xHandleFilterSubmit,
          xHandleFilterClose: this.xHandleFilterClose,
        }}
      />
    )
  }

  // Need for Flow. Will get properly set in constructor function
  xHandleDebugToggle = () => {}

  xHandleFilterChange = () => {}

  xHandleFilterOpen = () => {}

  xHandleFilterSubmit = () => {}

  xHandleFilterClose = () => {}

  xHandleFileRun = () => {}
}

export { AppContainer }
export type {
  StateType as AppStateType,
  ActionsType as AppActionsType,
  TestFilesType,
}
