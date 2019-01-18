// @flow

import { spawn } from "child_process"
import { when, replaceBy, forEach } from "@asd14/m"

import type { AppState, TestFile } from "./app.container"

type SetStateCallbackFn = (prevState: AppState) => $Shape<AppState>

type SetStateFn = (
  fn: SetStateCallbackFn | $Shape<AppState>,
  callback?: Function
) => void

/**
 * Start node/tape process
 *
 * @param {Function}  setState  Store component setState
 * @param {string}    path      File path
 *
 * @return {undefined}
 */
const runOne = (setState: SetStateFn) => (path: string) => {
  setState(state => {
    const tapeProcess = spawn("tape", [path, ...state.runArgs], {
      cwd: process.cwd(),
      env: process.env,
      detatched: true,
      encoding: "utf8",
    })

    tapeProcess.stdout.on("data", data => {
      setState(prevState => ({
        files: replaceBy(
          { path },
          (item: TestFile): TestFile => ({
            ...item,
            content: [...item.content, data.toString()],
          })
        )(prevState.files),
      }))
    })

    tapeProcess.stderr.on("data", data => {
      setState(prevState => ({
        files: replaceBy(
          { path },
          (item: TestFile): TestFile => ({
            ...item,
            content: [...item.content, data.toString()],
          })
        )(prevState.files),
      }))
    })

    tapeProcess.on("exit", (code, signal) => {
      setState(prevState => ({
        files: replaceBy(
          { path },
          (item: TestFile): TestFile => ({
            ...item,
            code,
            signal,
            isLoading: false,
          })
        )(prevState.files),
      }))
    })

    return {
      fileSelectedPath: path,
      files: replaceBy(
        { path },
        (item: TestFile): TestFile => ({
          ...item,
          code: -1,
          signal: "",
          isLoading: true,
        })
      )(state.files),
    }
  })
}

/**
 * Start node/tape process for one or more test files
 *
 * @param {Function}           setState  Store component setState
 * @param {string|string[]}    paths     File path(s)
 *
 * @return {undefined}
 */
export const run = (setState: SetStateFn) => (paths: string | string[]) => {
  when(Array.isArray, forEach(runOne(setState)), runOne(setState))(paths)
}

/**
 * Change focused file
 *
 * @param {Function}  setState  Store component setState
 * @param {string}    path      File path
 *
 * @returns {undefined}
 */
export const changeSelected = (setState: SetStateFn) => (path: string) => {
  setState({
    fileSelectedPath: path,
  })
}

/**
 * Toggle File Details window
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const detailsToggle = (setState: SetStateFn) => () => {
  setState(prevState => ({
    isDebugVisible: !prevState.isDebugVisible,
  }))
}

/**
 * Show filter input
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const filterOpen = (setState: SetStateFn) => () => {
  setState({
    isFilterVisible: true,
  })
}

/**
 * Hide filter input and clear filter query
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const filterClose = (setState: SetStateFn) => () => {
  setState({
    filterQuery: "",
    isFilterVisible: false,
  })
}

/**
 * Change List filter value
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const filterChange = (setState: SetStateFn) => (query: string) => {
  setState({
    filterQuery: query,
  })
}

/**
 * Hide filter input
 *
 * @param {Function}  setState  Store component setState
 *
 * @return {undefined}
 */
export const filterSubmit = (setState: SetStateFn) => () => {
  setState({
    isFilterVisible: false,
  })
}
