// @flow

import * as React from "react"
import { map, findBy } from "@asd14/m"

import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"

import type { StoreStateType, TestFilesType } from "./store"
import type { UIListItemType } from "../ui/list/list"

type PropsType = {
  name: string,
  version: string,
} & StoreStateType

class App extends React.Component<PropsType> {
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
    const { onDebugToggle } = this.props

    this.refApp.screen.key(["i"], () => {
      onDebugToggle && onDebugToggle()
    })

    this.refApp.screen.key(["C-c"], () => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    })
  }

  render = (): React.Node => {
    const {
      name,
      version,
      files,
      filesSelectedPath,
      runArgs,
      isDebugVisible,
      onFileSelect,
    } = this.props
    const filesSelected: TestFilesType =
      findBy({ path: filesSelectedPath })(files) ?? {}

    return (
      <box ref={this.linkRefApp}>
        <UIList
          selectedId={filesSelected.path}
          top="0"
          left="0"
          width="30%+1"
          height="100%-1"
          items={map(
            (item: TestFilesType): UIListItemType => ({
              id: item.path,
              label: item.name,
              code: item.code,
              isLoading: item.isLoading,
            })
          )(Object.values(files))}
          onSelect={onFileSelect}
        />
        <UIFile
          label={filesSelected.name}
          path={filesSelected.path}
          top="0"
          left="30%"
          width="70%"
          height={isDebugVisible ? "70%" : "100%-1"}
          content={filesSelected.content}
          code={filesSelected.code}
          signal={filesSelected.signal}
        />
        {isDebugVisible ? (
          <UIDebug
            label="Debug"
            value={{
              Node: process.execPath,
              Path: filesSelected.path,
              Args: runArgs,
              "Exit code": filesSelected.code,
            }}
            top="70%-1"
            left="30%"
            width="70%"
            height="30%"
          />
        ) : null}
        <box
          top="100%-1"
          left="0"
          width="50%"
          tags={true}
          transparent={false}
          content="{white-bg}{black-fg}C-c{/} Exit {white-bg}{black-fg}i{/} Toggle debug"
        />
        <box
          top="100%-1"
          right="0"
          width="50%"
          tags={true}
          content={`{right}${name} v${version}{/right}`}
        />
      </box>
    )
  }

  /**
   * Links a reference box.
   *
   * @param  {Object}  ref  The reference object
   *
   * @return {undefined}
   */
  linkRefApp = (ref: Object) => {
    this.refApp = ref
  }

  refApp = {}
}

export { App }
