// @flow

const debug = require("debug")("TapeUI:MainPageState")

import * as React from "react"
import { spawn } from "child_process"
import { basename } from "path"
import { replaceBy, head, get, pipe, findFiles, reduce } from "@asd14/m"

import {} from "./actions"

type TestFilesType = {|
  path: string,
  name: string,
  content: string[],
  code?: number,
  signal?: string,
|}

type PropsType = {|
  pattern: RegExp,
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
    const files = pipe(
      findFiles(pattern),
      reduce(
        (acc, filePath): TestFilesType[] => [
          ...acc,
          {
            path: filePath,
            name: basename(filePath),
            content: [],
            code: undefined,
            signal: undefined,
          },
        ],
        []
      )
    )(root)

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
    const testProcess = spawn("node", [path], {
      cwd: process.cwd(),
      env: process.env,
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
              content: [...item.content, data.toString()],
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
