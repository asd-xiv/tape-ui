// @flow

const debug = require("debug")("TapeUI:Store")

import * as React from "react"
import glob from "glob"
import { basename } from "path"
import { reduce, map, head, get, pipe } from "@asd14/m"

import { runTestFile } from "./actions"

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

type StoreStateType = {|
  files?: TestFilesType[],
  filesSelectedPath?: string,
  runArgs?: string[],
  isLoading?: boolean,
  onFileSelect?: (path: string) => void,
|}

const { Provider, Consumer } = React.createContext<StoreStateType>({
  files: [],
  filesSelectedPath: "",
  runArgs: [],
  isLoading: false,
})

class Store extends React.Component<PropsType, StoreStateType> {
  state = {
    files: [],
    filesSelectedPath: "",
    runArgs: [],
    isLoading: false,
  }

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
      glob.sync(pattern, {
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
      isLoading: false,
    }
  }

  render = (): React.Node => {
    const { children } = this.props
    const { files, filesSelectedPath, runArgs, isLoading } = this.state

    return (
      <Provider
        value={{
          files,
          filesSelectedPath,
          runArgs,
          isLoading,
          onFileSelect: this.handleTestFileRun,
        }}>
        {children}
      </Provider>
    )
  }

  handleTestFileRun = (path: string) => {
    const { runArgs } = this.state

    this.xHandleTestRun({ path, args: runArgs })

    this.setState({
      filesSelectedPath: path,
    })
  }

  xHandleTestRun = runTestFile(this.setState.bind(this))
}

export { Store, Consumer }
export type { StoreStateType, TestFilesType }
