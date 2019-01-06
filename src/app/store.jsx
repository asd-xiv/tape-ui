// @flow

import * as React from "react"
import glob from "glob"
import { basename } from "path"
import { reduce, map, head, get, pipe } from "@asd14/m"

import { handleTestFileRun, handleDebugToggle } from "./actions"

type TestFilesType = {|
  path: string,
  name: string,
  content: string[],
  code?: number,
  signal?: string,
  isLoading: boolean,
|}

type PropsType = {|
  requireModules: string[],
  pattern: string,
  root: string,
  children: React.Node,
|}

type StoreStateType = {
  files?: TestFilesType[],
  filesSelectedPath?: string,
  runArgs?: string[],
  isDebugVisible?: boolean,
}

class Store extends React.Component<PropsType, StoreStateType> {
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

    const { requireModules, pattern, root } = props
    const files = map(
      (item): TestFilesType => ({
        path: item,
        name: basename(item),
        content: [],
        code: undefined,
        signal: undefined,
        isLoading: false,
      })
    )(
      glob.sync(`**/${pattern}`, {
        absolute: true,
        cwd: root,
      })
    )

    this.state = {
      files,
      filesSelectedPath: pipe(
        head,
        get("path")
      )(files),
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
    const { children } = this.props
    const { files, filesSelectedPath, runArgs, isDebugVisible } = this.state

    return React.Children.map(
      children,
      (child): React.Node =>
        React.cloneElement(child, {
          store: {
            files,
            filesSelectedPath,
            runArgs,
            isDebugVisible,
          },
          actions: {
            xHandleTestFileRun: this.xHandleTestFileRun,
            xHandleDebugToggle: this.xHandleDebugToggle,
          },
        })
    )
  }

  xHandleDebugToggle = undefined

  xHandleTestFileRun = undefined
}

export { Store }
export type { StoreStateType, TestFilesType }
