// @flow

const debug = require("debug")("TapeUI:MainPage")

import * as React from "react"
import { map, findBy } from "@asd14/m"

import { Consumer } from "../store"
import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"

import type { StoreStateType, TestFilesType } from "../store"
import type { UIListItemType } from "../ui/list/list"

export const MainPage = (): React.Node => (
  <Consumer>
    {({
      files = [],
      filesSelectedPath = "",
      runArgs = [],
      onFileSelect,
    }: StoreStateType): React.Node => {
      const filesSelected: TestFilesType =
        findBy({ path: filesSelectedPath })(files) ?? {}

      return [
        <UIList
          key="files"
          selectedId={filesSelected.path}
          top={0}
          left={0}
          width="30%"
          height="100%"
          items={map(
            (item: TestFilesType): UIListItemType => ({
              id: item.path,
              label: item.name,
              code: item.code,
              isLoading: item.isLoading,
            })
          )(Object.values(files))}
          onSelect={onFileSelect}
        />,
        <UIFile
          key="files-selected"
          label={filesSelected.name}
          path={filesSelected.path}
          top={0}
          left="30%"
          width="70%"
          height="70%"
          content={filesSelected.content}
          code={filesSelected.code}
          signal={filesSelected.signal}
        />,
        <UIDebug
          key="debug"
          label="Debug"
          value={{
            Node: process.execPath,
            Path: filesSelected.path,
            Args: runArgs,
            "Exit code": filesSelected.code,
          }}
          top="70%"
          left="30%"
          width="70%"
          height="30%"
        />,
      ]
    }}
  </Consumer>
)
