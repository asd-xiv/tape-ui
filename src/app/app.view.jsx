import React from "react"
import PropTypes from "prop-types"
import {
  pipe,
  max,
  map,
  findWith,
  replace,
  hasWith,
  filter,
  contains,
  countWith,
} from "@mutant-ws/m"

import { UIFile } from "../ui/file/file"
import { UIList } from "../ui/list/list"
import { UIDebug } from "../ui/debug/debug"
import { UITitle } from "../ui/title/title"
import { UIInput } from "../ui/input/input"
import { UIStatus } from "../ui/status/status"

const AppView = ({
  name,
  version,
  files,
  fileSelectedPath,
  filterQuery,
  runArgs,
  isDebugVisible,
  isFilterVisible,
  onChangeSelected,
  onRun,
  onFilterChange,
  onFilterSubmit,
  onFilterClose,
}) => {
  const filesSelected = findWith({ path: fileSelectedPath })(files) ?? {}
  const filesFiltered = filter(item => contains(filterQuery)(item.path))(files)
  const listWidth =
    pipe(
      map(item => item.name.length),
      max
    )(files) + 6

  return (
    <>
      <UIStatus
        left={0}
        top={0}
        width={listWidth + 2}
        totalCount={files.length}
        failCount={countWith({ code: 1 })(files)}
        runningCount={countWith({ isLoading: true })(files)}
        isLoading={hasWith({ isLoading: true })(files)}
      />

      <UIList
        selectedId={filesSelected.path}
        top={1}
        left={0}
        width={listWidth}
        height="100%-1"
        items={map(item => ({
          id: item.path,
          label: replace(filterQuery, `{bold}${filterQuery}{/bold}`)(item.name),
          code: item.code,
          isLoading: item.isLoading,
        }))(filesFiltered)}
        onChange={onChangeSelected}
        onSelect={onRun}
      />

      <line
        orientation="vertical"
        top={1}
        left={listWidth + 1}
        height="100%-1"
        width={1}
      />

      <UITitle name={name} version={version} />

      <UIFile
        path={filesSelected.path}
        top={1}
        left={listWidth + 1}
        width={`100%-${listWidth + 1}`}
        height={isDebugVisible ? "100%-10" : "100%-1"}
        content={[
          filesSelected.stdout,
          `{red-fg}${filesSelected.stderr}{/}`,
        ].join("\n")}
        code={filesSelected.code}
        isLoading={filesSelected.isLoading}
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
          top="100%-10"
          left={listWidth + 1}
          width={`100%-${listWidth + 1}`}
          height={10}
        />
      ) : null}

      {isFilterVisible ? (
        <UIInput
          top="100%-1"
          width="30%"
          left="0"
          label="Filter:"
          value={filterQuery}
          onChange={onFilterChange}
          onSubmit={onFilterSubmit}
          onCancel={onFilterClose}
        />
      ) : null}
    </>
  )
}

AppView.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,

  files: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  fileSelectedPath: PropTypes.string.isRequired,
  filterQuery: PropTypes.string.isRequired,
  runArgs: PropTypes.arrayOf(PropTypes.string).isRequired,
  isDebugVisible: PropTypes.bool.isRequired,
  isFilterVisible: PropTypes.bool.isRequired,

  onChangeSelected: PropTypes.func.isRequired,
  onRun: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onFilterSubmit: PropTypes.func.isRequired,
  onFilterClose: PropTypes.func.isRequired,
}

export { AppView }
