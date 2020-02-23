import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import glob from "glob"
import { fork } from "child_process"
import { basename } from "path"
import { has, forEach, reduce, map } from "@mutantlove/m"

import { AppView } from "./app.view"

// Offloading all file execution to secondary process
const executor = fork(`${__dirname}/../lib/executor.js`)

const AppContainer = ({
  name,
  version,
  screen,
  requireModules,
  filePattern,
  rootPath,
}) => {
  const filePaths = glob.sync(`**/${filePattern}`, {
    absolute: true,
    cwd: rootPath,
  })

  const [files, setFiles] = useState(
    map(item => ({
      path: item,
      name: basename(item),
      stdout: "",
      stderr: "",
      code: -1,
      isLoading: false,
    }))(filePaths)
  )
  const [fileSelectedPath, setFileSelectedPath] = useState(filePaths[0])
  const [filterQuery, setFilterQuery] = useState("")
  const [isDebugVisible, setIsDebugVisible] = useState(false)
  const [isFilterVisible, setIsFilterVisible] = useState(false)

  const executorRunArgs = reduce(
    (acc, item) => [...acc, "-r", item],
    []
  )(requireModules)

  // Update file data coming from secondary process
  useEffect(() => {
    const handleDone = file => {
      setFiles(
        map(item =>
          item.path === file.path
            ? {
                ...item,
                ...file,
                isLoading: false,
              }
            : item
        )(files)
      )
    }

    executor.on("message", handleDone)

    return () => executor.removeListener("message", handleDone)
  }, [files])

  const handleDetailsToggle = () => setIsDebugVisible(prev => !prev)

  const handleFilterOpen = () => setIsFilterVisible(true)

  const handleFilterClose = () => {
    setIsFilterVisible(false)
    setFilterQuery("")
  }

  useEffect(() => {
    screen.key(["i"], () => {
      handleDetailsToggle()
    })

    screen.key(["/"], () => {
      handleFilterOpen()
    })

    screen.key(["tab"], () => {
      screen.focusNext()
    })

    screen.key(["escape"], () => {
      isFilterVisible && handleFilterClose()
    })

    screen.onceKey(["C-c", "q"], () => {
      // eslint-disable-next-line unicorn/no-process-exit
      process.exit(0)
    })
  }, [screen, isFilterVisible])

  //
  const handleRun = path => {
    const paths = Array.isArray(path) ? path : [path]

    setFiles(
      map(item =>
        has(item.path)(paths)
          ? {
              ...item,
              code: -1,
              signal: "",
              isLoading: true,
            }
          : item
      )(files)
    )

    // send file to secondary process for execution
    forEach(item => {
      executor.send({ path: item, runArgs: executorRunArgs })
    })(paths)
  }

  const handleChangeSelected = path => setFileSelectedPath(path)

  const handleFilterChange = query => setFilterQuery(query)

  const handleFilterSubmit = () => setIsFilterVisible(false)

  return (
    <AppView
      name={name}
      version={version}
      files={files}
      fileSelectedPath={fileSelectedPath}
      filterQuery={filterQuery}
      runArgs={executorRunArgs}
      isDebugVisible={isDebugVisible}
      isFilterVisible={isFilterVisible}
      onChangeSelected={handleChangeSelected}
      onRun={handleRun}
      onDetailsToggle={handleDetailsToggle}
      onFilterChange={handleFilterChange}
      onFilterOpen={handleFilterOpen}
      onFilterSubmit={handleFilterSubmit}
      onFilterClose={handleFilterClose}
    />
  )
}

AppContainer.propTypes = {
  name: PropTypes.string.isRequired,
  version: PropTypes.string.isRequired,
  screen: PropTypes.shape({
    focusNext: PropTypes.func.isRequired,
    key: PropTypes.func.isRequired,
    onceKey: PropTypes.func.isRequired,
  }).isRequired,
  requireModules: PropTypes.arrayOf(PropTypes.string).isRequired,
  filePattern: PropTypes.string.isRequired,
  rootPath: PropTypes.string.isRequired,
}

export { AppContainer }
