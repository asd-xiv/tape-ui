// @flow

import { spawn } from "child_process"
import { replaceBy } from "@asd14/m"

import type { ChildProcess } from "child_process"
import type { StoreStateType, TestFilesType } from "./store"

/**
 * Run one file
 *
 * @param {Object}    state     Store component state
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const handleTestFileRun = (
  { runArgs = [] }: StoreStateType,
  setState: Function
): Function => (path: string): ChildProcess => {
  const tapeProcess = spawn("tape", [path, ...runArgs], {
    cwd: process.cwd(),
    env: process.env,
    detatched: true,
    encoding: "utf8",
  })

  setState(
    (prevState): StoreStateType => ({
      filesSelectedPath: path,
      files: replaceBy(
        { path },
        (item: TestFilesType): TestFilesType => ({
          ...item,
          code: undefined,
          signal: undefined,
          isLoading: true,
        })
      )(prevState.files),
    }),
    () => {
      tapeProcess.stdout.on("data", data => {
        setState(
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

      tapeProcess.stderr.on("data", data => {
        setState(
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

      tapeProcess.on("exit", (code, signal) => {
        setState(
          (prevState): StoreStateType => ({
            files: replaceBy(
              { path },
              (item: TestFilesType): TestFilesType => ({
                ...item,
                code,
                signal,
                isLoading: false,
              })
            )(prevState.files),
          })
        )
      })
    }
  )

  return tapeProcess
}

/**
 * Toggle Debug window display
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const handleDebugToggle = (setState: Function): Function => () => {
  setState(
    (prevState): StoreStateType => ({
      isDebugVisible: !prevState.isDebugVisible,
    })
  )
}
