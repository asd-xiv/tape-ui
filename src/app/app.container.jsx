// @flow

import * as React from "react"
import glob from "glob"
import { basename } from "path"
import { reduce, map } from "@asd14/m"

import { handleTestFileRun, handleDebugToggle } from "./actions"
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
  name: string,
  version: string,
  projectName: string,
  projectVersion: string,
  requireModules: string[],
  filePattern: string,
  rootPath: string,
|}

type StateType = {
  files?: TestFilesType[],
  filesSelectedPath?: string,
  runArgs?: string[],
  isDebugVisible?: boolean,
}

type ActionsType = {
  xHandleTestFileRun: (path: string) => void,
  xHandleDebugToggle: () => void,
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
      filesSelectedPath: undefined,
      runArgs: reduce((acc, item): string[] => [...acc, "-r", item], [])(
        requireModules
      ),
      isDebugVisible: false,
    }

    this.xHandleDebugToggle = handleDebugToggle(this.setState.bind(this))
    this.xHandleTestFileRun = handleTestFileRun(
      this.state,
      this.setState.bind(this)
    )
  }

  /**
   * When called, it should examine this.props and this.state and return a
   * single React element. This element can be either a representation of a
   * native DOM component, such as <div />, or another composite component
   * that you've defined yourself.
   *
   * @return {Component}
   */
  render = (): React.Node => {
    const { name, version, projectName, projectVersion } = this.props
    const { files, filesSelectedPath, runArgs, isDebugVisible } = this.state

    return (
      <AppView
        name={name}
        version={version}
        projectName={projectName}
        projectVersion={projectVersion}
        store={{
          files,
          filesSelectedPath,
          runArgs,
          isDebugVisible,
        }}
        actions={{
          xHandleTestFileRun: this.xHandleTestFileRun,
          xHandleDebugToggle: this.xHandleDebugToggle,
        }}
      />
    )
  }

  // Need for Flow. Will get properly set in constructor function
  xHandleDebugToggle = () => {}

  xHandleTestFileRun = () => {}
}

export { AppContainer }
export type {
  StateType as AppStateType,
  ActionsType as AppActionsType,
  TestFilesType,
}
