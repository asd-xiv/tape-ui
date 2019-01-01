// @flow

const debug = require("debug")("TapeUI:MainPage")

import * as React from "react"
import { map, findBy } from "@asd14/m"

import { Consumer } from "../state"
import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"

import type { StoreStateType, TestFilesType } from "../state"
import type { UIListItemType } from "../ui/list/list"

export const MainPage = (): React.Node => (
  <Consumer>
    {({
      files = [],
      filesSelectedPath = "",
      onFileSelect,
    }: StoreStateType): React.Node => {
      const filesSelected = findBy({ path: filesSelectedPath })(files) ?? {}

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
            })
          )(Object.values(files))}
          onSelect={onFileSelect}
        />,
        <UIFile
          key="files-selected"
          label={filesSelected.name}
          top={0}
          left="30%"
          width="70%"
          height="100%"
          content={filesSelected.content}
          code={filesSelected.code}
          signal={filesSelected.signal}
        />,
      ]
    }}
  </Consumer>
)
