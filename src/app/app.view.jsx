// @flow

import * as React from "react"
import {
  map,
  findBy,
  replace,
  hasWith,
  filter,
  contains,
  isEmpty,
} from "@asd14/m"

import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"
import { UIMenu } from "../ui/menu/menu"
import { UIInput } from "../ui/input/input"

import type { TestFile, AppState, AppActions } from "./app.container"
import type { ListItem } from "../ui/list/list__item"

type Props = {
  actions: AppActions,
  name: string,
  projectVersion: string,
  store: AppState,
  version: string,
}

class AppView extends React.Component<Props> {
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
      store: {
        files,
        fileSelectedPath,
        filterQuery,
        runArgs,
        isDebugVisible,
        isFilterVisible,
      },
      actions: {
        xHandleChangeSelected,
        xHandleRun,
        xHandleFilterChange,
        xHandleFilterSubmit,
        xHandleFilterClose,
      },
    } = this.props
    const filesSelected: TestFile =
      findBy({ path: fileSelectedPath })(files) ?? {}
    const filesFiltered = filter(item => contains(filterQuery)(item.path))(
      files
    )

    return [
      <UIList
        key="app-files-list"
        selectedId={filesSelected.path}
        label={
          isEmpty(filterQuery)
            ? `${files.length} files`
            : `${filesFiltered.length}/${files.length} files`
        }
        top="0"
        left="0"
        width="30%"
        height="100%-1"
        items={map(
          (item: TestFile): ListItem => ({
            id: item.path,
            label: replace(filterQuery, `{bold}${filterQuery}{/bold}`)(
              item.name
            ),
            code: item.code,
            isLoading: item.isLoading,
          })
        )(filesFiltered)}
        isLoading={hasWith({ isLoading: true })(files)}
        onChange={xHandleChangeSelected}
        onSelect={xHandleRun}
      />,
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
        isLoading={filesSelected.isLoading}
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
          top="70%"
          left="30%"
          width="70%"
          height="30%"
        />
      ) : null,
      isFilterVisible ? (
        <UIInput
          key="files-selected-filter-input"
          top="100%-1"
          width="30%"
          left="0"
          label="Filter:"
          value={filterQuery}
          onChange={xHandleFilterChange}
          onSubmit={xHandleFilterSubmit}
          onCancel={xHandleFilterClose}
        />
      ) : (
        <UIMenu
          key="app-menu"
          name={name}
          version={version}
          isDebugVisible={isDebugVisible}
          isFilterVisible={isFilterVisible}
        />
      ),
    ]
  }
}

export { AppView }
