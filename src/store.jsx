// @flow

const debug = require("debug")("TapeUI:Store")

import * as React from "react"
import glob from "glob"
import { spawn } from "child_process"
import { basename } from "path"
import { map, replaceBy, head, get, pipe } from "@asd14/m"

type TestFilesType = {|
  path: string,
  name: string,
  content: string[],
  code?: number,
  signal?: string,
|}

type PropsType = {|
  require: string[],
  pattern: string,
  root: string,
  children: React.Node,
|}

type StoreStateType = {|
  files?: TestFilesType[],
  filesSelectedPath?: string,
  isLoading?: boolean,
  onFileSelect?: (path: string) => void,
|}

const { Provider, Consumer } = React.createContext<StoreStateType>({
  files: [],
  filesSelectedPath: "",
  isLoading: false,
})

class Store extends React.Component<PropsType, StoreStateType> {
  state = {
    files: [],
    filesSelectedPath: "",
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

    const { pattern, root } = props
    const files = map(
      (item): TestFilesType => ({
        path: item,
        name: basename(item),
        content: [],
        code: undefined,
        signal: undefined,
      })
    )(
      glob.sync(pattern, {
        absolute: true,
        cwd: root,
        root,
      })
    )

    this.state = {
      files,
      filesSelectedPath: pipe(
        head,
        get("path")
      )(files),
      isLoading: false,
    }
  }

  render = (): React.Node => {
    const { children } = this.props
    const { files, filesSelectedPath, isLoading } = this.state

    return (
      <Provider
        value={{
          files,
          filesSelectedPath,
          isLoading,
          onFileSelect: this.handleTestFileRun,
        }}>
        {children}
      </Provider>
    )
  }

  handleTestFileRun = (path: string) => {
    const { require } = this.props

    const testProcess = spawn(process.execPath, [path, ...require], {
      detatched: false,
      encoding: "utf8",
    })

    this.setState({
      filesSelectedPath: path,
    })

    // Main output
    testProcess.stdout.on("data", data => {
      this.setState(
        (prevState): StoreStateType => ({
          files: replaceBy(
            { path },
            (item: TestFilesType): TestFilesType => ({
              ...item,
              content: [path, ...require, ...item.content, data.toString()],
            })
          )(prevState.files),
        })
      )
    })

    // Error output
    testProcess.stderr.on("data", data => {
      this.setState(
        (prevState): StoreStateType => ({
          files: replaceBy(
            { path },
            (item: TestFilesType): TestFilesType => ({
              ...item,
              content: [...item.content, data.toString()],
            })
          )(prevState.files),
        })
      )
    })

    testProcess.on("exit", (code, signal) => {
      this.setState(
        (prevState): StoreStateType => ({
          files: replaceBy(
            { path },
            (item: TestFilesType): TestFilesType => ({
              ...item,
              code,
              signal,
            })
          )(prevState.files),
        })
      )
    })
  }
}

export { Store, Consumer }
export type { StoreStateType, TestFilesType }
