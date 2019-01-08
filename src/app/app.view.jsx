// @flow

import * as React from "react"
import { map, findBy } from "@asd14/m"

import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"
import { UIMenu } from "../ui/menu/menu"
import { UIInput } from "../ui/input/input"

import type {
  TestFilesType,
  AppStateType,
  AppActionsType,
} from "./app.container"
import type { UIListItemType } from "../ui/list/list"

type PropsType = {
  name: string,
  version: string,
  projectName: string,
  projectVersion: string,
  store: AppStateType,
  actions: AppActionsType,
}

class AppView extends React.Component<PropsType> {
  /**
   * Examine this.props and this.state and return a single React element. This
   * element can be either a representation of a native DOM component, such as
   * <div />, or another composite component that you've defined yourself.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    const {
      name,
      version,
      projectName,
      store: {
        filesSelectedPath,
        files,
        filesFilter,
        runArgs,
        isDebugVisible,
        isFilterVisible,
      },
      actions: {
        xHandleFileRun,
        xHandleFilterChange,
        xHandleFilterSubmit,
        xHandleFilterClose,
      },
    } = this.props
    const filesSelected: TestFilesType =
      findBy({ path: filesSelectedPath })(files) ?? {}

    return [
      <UIList
        key="app-files-list"
        selectedId={filesSelected.path}
        label={projectName}
        filter={filesFilter}
        top="0"
        left="0"
        width="30%+1"
        height={isFilterVisible ? "100%-3" : "100%-1"}
        items={map(
          (item: TestFilesType): UIListItemType => ({
            id: item.path,
            label: item.name,
            code: item.code,
            isLoading: item.isLoading,
          })
        )(Object.values(files))}
        onSelect={xHandleFileRun}
      />,
      isFilterVisible ? (
        <UIInput
          key="files-selected-filter-input"
          top="100%-4"
          width="30%+1"
          left="0"
          label="Filter:"
          value={filesFilter}
          onChange={xHandleFilterChange}
          onSubmit={xHandleFilterSubmit}
          onCancel={xHandleFilterClose}
        />
      ) : null,
      <UIFile
        key="app-files-selected"
        label={filesSelected.name}
        path={filesSelected.path}
        top="0"
        left="30%"
        width="70%"
        height={isDebugVisible ? "70%" : "100%-1"}
        content={filesSelected.content}
        code={filesSelected.code}
        signal={filesSelected.signal}
      />,
      isDebugVisible ? (
        <UIDebug
          key="app-details"
          label="Details"
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
      ) : null,
      <UIMenu
        key="app-menu"
        name={name}
        version={version}
        isDebugVisible={isDebugVisible}
        isFilterVisible={isFilterVisible}
      />,
    ]
  }
}

export { AppView }
