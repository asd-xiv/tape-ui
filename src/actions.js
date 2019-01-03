// @flow

import { spawn } from "child_process"
import { replaceBy } from "@asd14/m"

import type { ChildProcess } from "child_process"
import type { StoreStateType, TestFilesType } from "./store"

type CMDDefType = {|
  path: string,
  args: string[],
|}

export const runTestFile = setState => ({
  path,
  args,
}: CMDDefType): ChildProcess => {
  const tapeProcess = spawn("tape", [path, ...args], {
    cwd: process.cwd(),
    env: process.env,
    detatched: true,
    encoding: "utf8",
  })

  setState(
    (prevState): StoreStateType => ({
      files: replaceBy(
        { path },
        (item: TestFilesType): TestFilesType => ({
          ...item,
          content: [],
          code: undefined,
          isLoading: true,
        })
      )(prevState.files),
    })
  )

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

  return tapeProcess
}
