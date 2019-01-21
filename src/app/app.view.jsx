// @flow

import * as React from "react"
import {
  pipe,
  max,
  map,
  findBy,
  replace,
  hasWith,
  filter,
  contains,
  countBy,
} from "@asd14/m"

import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"
import { UITitle } from "../ui/title/title"
import { UIInput } from "../ui/input/input"
import { UIStatus } from "../ui/status/status"

import type { TestFile, AppState, AppActions } from "./app.container"
import type { ListItem } from "../ui/list/list__item"

type Props = {
  name: string,
  version: string,
  store: $Shape<AppState>,
  actions: AppActions,
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
    const listWidth =
      pipe(
        map(item => item.name.length),
        max
      )(files) + 6

    return [
      <UIStatus
        key="app-status"
        left={0}
        top={0}
        width={listWidth}
        total={files.length}
        fail={countBy({ code: 1 })(files)}
        run={countBy({ isLoading: true })(files)}
        isLoading={hasWith({ isLoading: true })(files)}
      />,
      <UIList
        key="app-files-list"
        selectedId={filesSelected.path}
        top={1}
        left={0}
        width={listWidth}
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
        onChange={xHandleChangeSelected}
        onSelect={xHandleRun}
      />,
      <UITitle key="app-title" name={name} version={version} />,
      <UIFile
        key="app-files-selected"
        path={filesSelected.path}
        top={1}
        left={listWidth - 1}
        width={`100%-${listWidth}`}
        height={isDebugVisible ? "70%" : "100%-1"}
        content={[
          filesSelected.stdout,
          `{red-fg}${filesSelected.stderr}{/}`,
        ].join("\n")}
        code={filesSelected.code}
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
          left={listWidth}
          width={`100%-${listWidth}`}
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
      ) : null,
    ]
  }
}

export { AppView }
